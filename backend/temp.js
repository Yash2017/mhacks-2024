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

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    // Fail ping throws an error
    console.error("Error occurred during ping:", err);
  }
}

run().catch(console.dir);

async function listDatabases(client){ 
  databasesList = await client.db().admin().listDatabases();

  try {
    database = await client.db('msg_history');
    collection = await database.collection('msgs');

    const insertResult = await collection.insertOne({ name: "Alice", age: 25, occupation: "Engineer" });
    console.log('Insert Result:', insertResult);

    const findResult = await collection.find({ age: { $gte: 20 } }).toArray();
    console.log('Found Documents:', findResult);

    const updateResult = await collection.updateOne({ name: "Alice" }, { $set: { age: 26 } });
    console.log('Update Result:', updateResult);

    const deleteResult = await collection.deleteOne({ name: "Alice" });
    console.log('Delete Result:', deleteResult);
  } catch {
    console.error("Error with MongoDB operations:", err);
  }

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

listDatabases(client).catch(console.error);

async function run1() {
  try {
    // Connect to MongoDB
    await client.connect();
    const db = client.db("myDatabase"); // Access your database

    // Create a collection
    await createCollection(db);

    // Drop a collection
    await deleteCollection(db);

  } catch (err) {
    console.error("Error during MongoDB operations:", err);
  } finally {
    await client.close();
  }
}

// Create collection function
async function createCollection(db) {
  try {
    const result = await db.createCollection("myNewCollection");
    console.log("Collection created:", result.collectionName);
  } catch (err) {
    console.error("Error creating collection:", err);
  }
}

// Drop collection function
async function deleteCollection(db) {
  try {
    const result = await db.collection("myNewCollection").drop();
    console.log("Collection dropped:", result);
  } catch (err) {
    console.error("Error dropping collection:", err);
  }
}

// Run the operations
run1().catch(console.dir);





app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

const port = process.env.PORT || 3000; // You can use environment variables for port configuration

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
