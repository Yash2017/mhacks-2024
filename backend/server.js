const express = require("express");
const app = express();
const cors = require('cors');

app.use(express.json());
// Enable CORS for all routes (or restrict it to specific origins)
app.use(cors({
  origin: 'http://localhost:3000', // Allow only this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify allowed methods if needed
  credentials: true, // Enable credentials (if needed)
}));

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

async function getfromcollection(collectionname, aistring) {
    try {
        await client.connect();
        const db = client.db('msg_history'+aistring);
        const collection = db.collection(collectionname);
  
        const elements = await collection.find({}).toArray();
        console.log("Fetched Data:", JSON.stringify(elements, null, 2));

        return elements;
    } catch (err) {
        console.error("Error fetching documents:", err);
        throw err;
    }
}


app.put('/newchat',(req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.id);
        const aistring = String(req.body.ai);
        const name = 'chat' + numastring;

        const database = client.db('msg_history' + aistring);
        database.createCollection(name);
    } catch (err) {
        console.error("Error making a new chat:", err);
        throw err;
    }
});

app.post('/onhover',(req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.id);
        const aistring = String(req.body.ai);
        const name = 'chat' + numastring;

        const database = client.db('msg_history'+aistring);
        const collection = database.collection(name);

        const data = getfromcollection(name, aistring); //somehow shorten this!!!!
        res.status(200).json(data);
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

app.post('/onclick', async (req, res)=>{
    try {
        //req is sent as a singular number from 1 to n that clarifies the index of the chat
        const numastring = String(req.body.id);
        const aistring = String(req.body.ai);
        const name = 'chat' + numastring;

        const data = await getfromcollection(name, aistring);
        console.log("Fetched Data:", JSON.stringify(data, null, 2));
        res.status(200).json(data);
        
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

app.post('/onupdate',(req, res)=>{
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.number);
    
});

app.post('/onmsg',(req, res)=>{
  try{
      //req is sent as a json pckg with id, msg, who, time
      const data = req.body;
      const numastring = String(data.id);
      const aistring = String(data.ai);
      const nam = 'chat' + numastring;

      const name = data.name;
      const msg = data.msg;
      const time = data.time;

      const document = {name, msg, time,};
      
      const database = client.db('msg_history' + aistring);
      const collection = database.collection(nam);
      collection.insertOne(document);
  } catch (err) {
      console.error("Error getting data on hover:", err);
      throw err;
  }
});

app.put('/onmsg',(req, res)=>{
    try{
        //req is sent as a json pckg with id, msg, who, time
        const data = req.body;
        const numastring = String(data.id);
        const aistring = String(data.ai);
        const nam = 'chat' + numastring;

        const name = data.name;
        const msg = data.msg;
        const time = data.time;

        const document = {name, msg, time,};
        
        const database = client.db('msg_history' + aistring);
        const collection = database.collection(nam);
        collection.insertOne(document);
    } catch (err) {
        console.error("Error getting data on hover:", err);
        throw err;
    }
});

app.get('/plusmodel', async (req, res) => {
  try {
    const database = client.db('models');

    // Get all collections in the 'models' database
    const collections = await database.listCollections().toArray();

    // Create an array to hold the collection names
    const collectionNames = collections.map(collection => collection.name);

    // Return the collection names
    res.status(200).json(collectionNames);

  } catch (err) {
    console.error("Error getting collections:", err);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});

app.get('/clickmodel', async(req, res)=>{
  try{
    const aistring = String(req.body.name);

    const database = client.db('models');
    const collection = database.collection(aistring);

    const documents = await collection.find({}, { projection: { id: 1 } }).toArray();

    // Return the documents with only the 'id' field
    res.status(200).json(documents);

  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

const port = process.env.PORT || 1337; // You can use environment variables for port configuration

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
