import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB connection
const mongoClient = new MongoClient(process.env.MONGO_URI!);
let db: any;

const connectDB = async () => {
  await mongoClient.connect();
  db = mongoClient.db(process.env.MONGO_DATABASE!);
};
connectDB();

export { db };
