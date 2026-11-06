import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI environment variable is missing!");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Global DB middleware
app.use(async (req, res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).json({ error: "Database Connection Failed: " + err.message });
  }
});

// Properties Route
app.get('/api/properties', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch properties: " + err.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend is working!' });
});

export default app;