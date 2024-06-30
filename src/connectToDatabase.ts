const { MongoClient } = require("mongodb");

const url = process.env.DATABASE_URL;
const client = new MongoClient(url);

export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to Atlas");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}
