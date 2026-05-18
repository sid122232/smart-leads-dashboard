import mongoose from 'mongoose';
import { config } from '../config';
import { logger } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    await mongoose.connect(config.mongoUri);
    logger.info('MongoDB connected successfully');
  } catch (err) {
    logger.error('MongoDB connection failed', err);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected. Attempting to reconnect...');
});

mongoose.connection.on('error', (err) => {
  logger.error('MongoDB error:', err);
});