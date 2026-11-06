import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

let isConnected = false;

async function connectDB() {
  if (isConnected && mongoose.connection.readyState === 1) return;
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is missing in Vercel settings!");
  }
  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}

// Get all properties
const handleProperties = async (req, res) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const properties = await db.collection('properties').find({}).toArray();
    return res.status(200).json(properties || []);
  } catch (err) {
    console.error("API Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Get single property by ID
const handleSingleProperty = async (req, res) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    const { id } = req.params;
    
    let queryId = id;
    try {
      queryId = new mongoose.Types.ObjectId(id);
    } catch (e) {
      // Keep as string if not a valid ObjectId
    }

    const property = await db.collection('properties').findOne({ 
      $or: [{ _id: queryId }, { _id: id }] 
    });

    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }

    // Wrap in { property } to match PropertyDetail.jsx expectation
    return res.status(200).json({ property });
  } catch (err) {
    console.error("Single Property API Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// Create New Property (Admin POST route)
const handleCreateProperty = async (req, res) => {
  try {
    await connectDB();
    const db = mongoose.connection.db;
    
    const propertyData = req.body;
    
    const result = await db.collection('properties').insertOne({
      ...propertyData,
      createdAt: new Date()
    });

    return res.status(201).json({ success: true, insertedId: result.insertedId });
  } catch (err) {
    console.error("Create Property Error:", err);
    return res.status(500).json({ error: err.message });
  }
};

app.get('/api/properties', handleProperties);
app.get('/properties', handleProperties);

app.post('/api/properties', handleCreateProperty);
app.post('/properties', handleCreateProperty);

app.get('/api/properties/:id', handleSingleProperty);
app.get('/properties/:id', handleSingleProperty);

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

export default app;