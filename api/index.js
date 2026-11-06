import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection with error catching
let cachedDb = null;

async function connectDB() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing!");
  }
  await mongoose.connect(process.env.MONGO_URI);
  cachedDb = mongoose.connection;
  console.log("MongoDB connected successfully");
}

// Simple test route to verify API is working
app.get('/api/properties', async (req, res) => {
  try {
    await connectDB();
    // Direct mongoose query or mock data to test if DB works
    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    res.json(properties);
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running live on Vercel!' });
});

export default app;