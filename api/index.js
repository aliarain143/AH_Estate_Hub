import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Database Connection Cache for Vercel Serverless
let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in Vercel settings!");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Global DB Connection Middleware
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error("DB Connection Error:", err);
    res.status(500).json({ error: "DB Error: " + err.message });
  }
});

// Properties Route (Handles both /api/properties and /properties)
const getProperties = async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: "Fetch error: " + err.message });
  }
};

app.get('/api/properties', getProperties);
app.get('/properties', getProperties);

// Health Route
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

export default app;