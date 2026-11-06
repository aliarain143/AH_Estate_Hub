import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

// Database Connection Manager
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in Vercel settings!");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// API Handler
const handleProperties = async (req, res) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    return res.status(200).json(properties);
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// API Endpoints
app.get('/api/properties', handleProperties);
app.get('/properties', handleProperties);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;