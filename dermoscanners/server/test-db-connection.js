import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';

dotenv.config();

async function testConnection() {
  try {
    console.log('Testing MongoDB connection with retry logic...\n');
    await connectDatabase(process.env.MONGO_URI);
    console.log('\n✓ Connection test successful!');
    process.exit(0);
  } catch (error) {
    console.error('\n✗ Connection test failed:', error.message);
    process.exit(1);
  }
}

testConnection();
