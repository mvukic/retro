import { MongoClient } from "mongodb";
import {Board} from "./types.ts";

const MONGODB_URI = "http://localhost:3000";

const client = new MongoClient(MONGODB_URI);

try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB");
} catch (error) {
    console.error("Error connecting to MongoDB:", error);
    Deno.exit(1);
}
const db = client.db("retro_db");
const boards = db.collection<Board>("boards");

export { db, boards };