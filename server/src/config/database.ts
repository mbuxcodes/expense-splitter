// MongoDB connection initialization. BACKEND_ARCHITECTURE.md Section 8:
// this is the ONLY module that configures the Mongoose connection itself --
// repositories query through models, they never touch connection state.
import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';

let isConnected = false;

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on('error', (error) => {
    logger.error(
      `MongoDB connection error: ${error instanceof Error ? error.message : String(error)}`,
    );
  });

  mongoose.connection.on('disconnected', () => {
    isConnected = false;
    logger.warn('MongoDB disconnected.');
  });

  try {
    await mongoose.connect(env.MONGODB_URI);
    isConnected = true;
    logger.info('MongoDB connected successfully.');
  } catch (error) {
    // Fail fast and loud -- a server that "starts" without a working database
    // connection is worse than one that refuses to start at all, per
    // BACKEND_ARCHITECTURE.md's production-first principle.
    logger.error(
      `Failed to connect to MongoDB: ${error instanceof Error ? error.message : String(error)}`,
    );
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  isConnected = false;
}

export function isDatabaseConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
