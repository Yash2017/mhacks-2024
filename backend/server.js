const express = require("express");
const app = express();
const cors = require("cors");
const OpenAI = require('openai')
require('dotenv').config();

const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
/*
const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const conversationContextPrompt = "Behave like you are a therapist";
*/
app.use(express.json());
// Enable CORS for all routes (or restrict it to specific origins)
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods if needed
    credentials: true, // Enable credentials (if needed)
  })
);

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://jamyu:Ne4kDbnqSFDKBzF4@cluster0.bjo2y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function testconnection() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.error("Error occurred during ping:", err);
  }
}

testconnection().catch(console.dir);

async function getfromcollection(collectionname, aistring) {
  try {
    await client.connect();
    const db = client.db("msg_history" + aistring);
    const collection = db.collection(collectionname);

    const elements = await collection.find({}).toArray();
    console.log("Fetched Data:", JSON.stringify(elements, null, 2));

    return elements;
  } catch (err) {
    console.error("Error fetching documents:", err);
    throw err;
  }
}

app.put("/newchat", (req, res) => {
  try {
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.id);
    const aistring = String(req.body.ai);
    const name = "chat" + numastring;

    const database = client.db("msg_history" + aistring);
    database.createCollection(name);
  } catch (err) {
    console.error("Error making a new chat:", err);
    throw err;
  }
});

app.post("/onhover", (req, res) => {
  try {
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.id);
    const aistring = String(req.body.ai);
    const name = "chat" + numastring;

    const database = client.db("msg_history" + aistring);
    const collection = database.collection(name);

    const data = getfromcollection(name, aistring); //somehow shorten this!!!!
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

app.post("/onclick", async (req, res) => {
  try {
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.id);
    const aistring = String(req.body.ai);
    const name = "chat" + numastring;

    const data = await getfromcollection(name, aistring);
    console.log("Fetched Data:", JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

app.post("/onupdate", async (req, res) => {
  try {
    //req is sent as a singular number from 1 to n that clarifies the index of the chat
    const numastring = String(req.body.id);
    const aistring = String(req.body.ai);
    const name = "chat" + numastring;

    const data = await getfromcollection(name, aistring);
    console.log("Fetched Data:", JSON.stringify(data, null, 2));
    res.status(200).json(data);
  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

app.post("/omg", (req, res) => {
  try {
    //req is sent as a json pckg with id, msg, who, time
    const message = req.body.message;

    // Calling the OpenAI API to complete the message
    openai.chat.completions.create({
        model: "ft:gpt-4o-mini-2024-07-18:concentration::ACeakFmi",
        // Adding the conversation context to the message being sent
        messages: [{role: 'user', content: message}]
      })
      .then((response) => {
        // Sending the response data back to the client
        res.send(response.choices[0].message);
      });
    // const numastring = String(data.id);
    // const aistring = String(data.ai);
    // const nam = "chat" + numastring;

    // const name = data.name;
    // const msg = data.msg;
    // const time = data.time;

    // const document = { name, msg, time };

    // const database = client.db("msg_history" + aistring);
    // const collection = database.collection(nam);
    // collection.insertOne(document);
  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

app.post("/onmsg", (req, res) => {
  try {
    //req is sent as a json pckg with id, msg, who, time
    const data = req.body;
    const numastring = String(data.id);
    const aistring = String(data.ai);
    const nam = "chat" + numastring;

    const name = data.name;
    const msg = data.msg;
    const time = data.time;

    const document = { name, msg, time };

    const database = client.db("msg_history" + aistring);
    const collection = database.collection(nam);
    collection.insertOne(document);

    openai.chat.completions.create({
      model: "ft:gpt-4o-mini-2024-07-18:concentration::ACeakFmi",
      // Adding the conversation context to the message being sent
      messages: [{role: 'user', content: msg}]
    })
    .then((response) => {
      const name = 'ai';
      const msg = response.choices[0].message.content;

      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0'); // Get hours and pad with zero if needed
      const minutes = String(now.getMinutes()).padStart(2, '0'); // Get minutes and pad with zero if needed
      const seconds = String(now.getSeconds()).padStart(2, '0'); // Get seconds and pad with zero if needed

      const time = `${hours}:${minutes}:${seconds}`;

      const adocument = { name, msg, time };
      
      // Sending the response data back to the client
      res.status(200).json(adocument);
    });

  } catch (err) {
    console.error("Error getting data on hover:", err);
    throw err;
  }
});

app.get("/plusmodel", async (req, res) => {
  try {
    const database = client.db("models");

    // Get all collections in the 'models' database
    const collections = await database.listCollections().toArray();

    // Create an array to hold the collection names
    const collectionNames = collections.map((collection) => collection.name);

    // Return the collection names
    res.status(200).json(collectionNames);
  } catch (err) {
    console.error("Error getting collections:", err);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
});

app.post("/clickmodel", async (req, res) => {
  try {
    const aistring = String(req.body.name);

    const database = client.db("models");
    const collection = database.collection(aistring);

    // Fetch documents from the collection with the projection for 'id' field
    const documents = await collection
      .find({}, { projection: { id: 1, _id: 0 } }) // Only include 'id' and exclude '_id'
      .toArray();

    // Get all collections in the 'models' database
    const firstId = documents.length > 0 ? documents[0].id : null;
    const datab = client.db('msg_history' + firstId)
    const collections = await datab.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name); // Extract collection names

    // Return both documents and the list of collection names
    res.status(200).json({
      documents,        // Array of documents with only 'id'
      collections: collectionNames, // Array of collection names
    });
  } catch (err) {
    console.error("Error getting data:", err);
    res.status(500).json({ error: "Failed to fetch data" }); // Respond with an error status and message
  }
});

const port = process.env.PORT || 1337; // You can use environment variables for port configuration

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
