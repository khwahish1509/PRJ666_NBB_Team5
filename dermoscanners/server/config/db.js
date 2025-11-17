// Import the mongoose library to interact with MongoDB
import mongoose from 'mongoose';

// Define an asynchronous function to connect to the MongoDB database
export async function connectDatabase(mongoUri) {
  // Check if the MongoDB URI is provided; throw an error if it's missing
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }

  // Enable strict query mode to enforce filtering only on defined schema paths
  mongoose.set('strictQuery', true);

  // Connection configuration with timeout
  const options = {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
    socketTimeoutMS: 45000,
  };

  // Retry logic: 3 attempts with exponential backoff
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[MongoDB] Attempting to connect... (Attempt ${attempt}/${maxRetries})`);
      
      await mongoose.connect(mongoUri, options);
      
      console.log('[MongoDB] ✓ Connected successfully');
      console.log('[MongoDB] Status: connected');
      
      // Set up connection event listeners
      mongoose.connection.on('connected', () => {
        console.log('[MongoDB] Status: connected');
      });

      mongoose.connection.on('disconnected', () => {
        console.log('[MongoDB] Status: disconnected');
      });

      mongoose.connection.on('error', (err) => {
        console.error('[MongoDB] Status: error -', err.message);
      });

      mongoose.connection.on('reconnected', () => {
        console.log('[MongoDB] Status: reconnected');
      });

      // Successfully connected
      return;
      
    } catch (error) {
      lastError = error;
      console.error(`[MongoDB] ✗ Connection attempt ${attempt} failed:`, error.message);
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait 2^attempt seconds before retry
        const waitTime = Math.pow(2, attempt) * 1000;
        console.log(`[MongoDB] Retrying in ${waitTime / 1000} seconds...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }

  // All retry attempts failed
  console.error('[MongoDB] Status: error - All connection attempts failed');
  throw new Error(`Failed to connect to MongoDB after ${maxRetries} attempts: ${lastError.message}`);
}

