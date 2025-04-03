import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/health-assistant';
console.log('MongoDB URI:', MONGODB_URI);

export const connectDB = async (): Promise<void> => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('MongoDB connected successfully');
    logger.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    if (error instanceof Error) {
      logger.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      logger.error('Unknown error connecting to MongoDB');
    }
    process.exit(1);
  }
}; 