import app from '../server/src/app.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.MONGO_URI && mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGO_URI).catch(err => console.error(err));
}

export default app;