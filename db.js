import { MongoClient } from "mongodb";


const url="mongodb+srv://herbalAdmin:StrongPassword123!@cluster0.ehfxiaw.mongodb.net/HerbalDB?retryWrites=true&w=majority"
const client = new MongoClient(url);

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.error(err);
  }
}

run();