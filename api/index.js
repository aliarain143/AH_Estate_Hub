import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/properties', async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.status(500).json({ error: "MONGO_URI is missing in Vercel Environment Variables!" });
    }
    
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URI);
    }

    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    res.status(200).json(properties);
  } catch (err) {
    res.status(500).json({ error: "DB Connect Error: " + err.message });
  }
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;