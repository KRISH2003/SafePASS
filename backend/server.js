const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb');
const bodyparser = require('body-parser')
const cors = require('cors')

dotenv.config()

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

// App & Database
const dbName = process.env.DB_NAME 
const app = express()
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyparser.json())
app.use(cors({
  origin: "https://safepass-backend-wtcu.onrender.com"
}));

// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Save a password
app.post('/', async (req, res) => {
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})

// Delete a password by id
app.delete('/', async (req, res) => {
    const { id } = req.body;

    const db = client.db(dbName);
    const collection = db.collection('passwords');

    const result = await collection.deleteOne({ id });

    res.send({ success: true, result });
});

async function startServer() {
    try {
        await client.connect();
        console.log("MongoDB connected");

        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

    } catch (err) {
        console.error(err);
    }
}

startServer();