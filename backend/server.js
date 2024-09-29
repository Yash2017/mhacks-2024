const express = require("express");
const app = express();

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jamyu:Ne4kDbnqSFDKBzF4@cluster0.bjo2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    }
});

async function testconnection() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });

        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (err) {
        console.error("Error occurred during ping:", err);
    }
}

testconnection().catch(console.dir);

async function getfromcollection(collectionname) {
    try {
        await client.connect();
        const db = client.db('msg_history');
        const collection = db.collection(collectionname);
  
        const elements = await collection.find({}).toArray();
        return elements;
    } catch (err) {
        console.error("Error fetching documents:", err);
        throw err;
    }
}


app.put('/newchat',(req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.number);
        const name = 'chat' + numastring;

        const database = client.db('msg_history');
        database.createCollection(name);
    } catch (err) {
        console.error("Error making a new chat:", err);
        throw err;
    }
});

app.get('/onhover',(req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.number);
        const name = 'chat' + numastring;

        const database = client.db('msg_history');
        const collection = database.collection(name);

        const data = getfromcollection(name); //somehow shorten this!!!!
        res.status(200).json(data);
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

app.get('/onclick',(req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.number);
        const name = 'chat' + numastring;

        const database = client.db('msg_history');
        const collection = database.collection(name);

        const data = getfromcollection(name);
        res.status(200).json(data);
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

app.get('/onupdate',(req, res)=>{
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.number);
    
});

app.post('/onmsg',(req, res)=>{
    try{
        //req is sent as a json pckg with id, msg, who, time
        const data = req.body;
        const numastring = String(data.number);
        const name = 'chat' + numastring;

        const n = data.name;
        const msg = data.msg;
        const time = data.time;

        const document = {n, msg, time,};
        
        const database = client.db('msg_history');
        const collection = database.collection(name);
        collection.insertOne(document);
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

const port = process.env.PORT || 3000; // You can use environment variables for port configuration

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
