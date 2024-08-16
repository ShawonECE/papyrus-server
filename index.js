const express = require('express');
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 3000;
const app = express();

// middlewares
app.use(cors(
    {
      origin: ['http://localhost:5173'],
    }
));
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5yhhqym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});

const db = client.db("papyrus");
const productsColl = db.collection("products");

async function run() {
    try {
        await client.connect();
        
        app.get('/', async (req, res) => {
            res.send('Welcome to papyrus');
        });

        app.get('/products', async (req, res) => {
            const name = req.query?.name;
            const skip = req.query?.skip;
            const limit = req.query?.limit;
            const sort = req.query?.sort;
            if (name) {
                const result = await productsColl.find().toArray();
                return res.send(result.filter(product => product.product_name.toLowerCase().includes(name.toLowerCase())));
            }
            if (sort === 'low_price_first') {
                const result = await productsColl.find().sort({ price: 1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
                res.send(result);
            } else if (sort === 'high_price_first') {
                const result = await productsColl.find().sort({ price: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
                res.send(result);
            } else if (sort === 'old_date_first') {
                const result = await productsColl.find().sort({ adding_date: 1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
                res.send(result);
            } else if (sort === 'new_date_first') {
                const result = await productsColl.find().sort({ adding_date: -1 }).skip(parseInt(skip)).limit(parseInt(limit)).toArray();
                res.send(result);
            } else {
                const result = await productsColl.find().skip(parseInt(skip)).limit(parseInt(limit)).toArray();
                res.send(result);
            }
        });

        app.get('/count', async (req, res) => {
            const count = await productsColl.estimatedDocumentCount();
            res.send({ count });
        })

    } finally {
        
    }
}

run().catch(console.dir);
app.listen(port);