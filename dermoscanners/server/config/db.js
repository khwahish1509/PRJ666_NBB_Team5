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

  // Attempt to connect to the MongoDB database using the provided URI
  await mongoose.connect(mongoUri);
}

