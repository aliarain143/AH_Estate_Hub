import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Import routes directly or use app from server
import propertyRoutes from '../server/src/routes/propertyRoutes.js';
import userRoutes from '../server/src/routes/userRoutes.js';
import inquiryRoutes from '../server/src/routes/inquiryRoutes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Connect Database
if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully on Vercel"))
    .catch(err => console.error("MongoDB connection error:", err));
}

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'API is running live on Vercel!' });
});

export default app;