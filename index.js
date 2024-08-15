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
            result = await productsColl.find().toArray();
            res.send(result);
        });

    } finally {
        
    }
}

run().catch(console.dir);
app.listen(port);