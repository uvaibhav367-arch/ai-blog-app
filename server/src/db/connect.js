import mongoose from 'mongoose';
import { config } from '../config/env.js';

export async function connectDatabase() {
  if (!config.mongoUri) {
    console.warn('[db] MONGODB_URI is not set - running with the in-memory post store.');
    return false;
  }

  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log('[db] connected to MongoDB');
    return true;
  } catch (error) {
    console.error(`[db] connection failed: ${error.message}`);
    console.error('[db] falling back to the in-memory post store.');
    return false;
  }
}

export async function disconnectDatabase() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
