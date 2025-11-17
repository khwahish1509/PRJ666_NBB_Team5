/**
 * Manual test script for AI endpoint
 * Run this to verify the endpoint works before connecting frontend
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://localhost:5001/api/ai/analyze';
const TEST_IMAGE_PATH = path.join(__dirname, 'test-image.jpg');

async function testAIEndpoint() {
  console.log('🧪 Testing AI Endpoint...\n');

  // Check if test image exists
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    console.error('❌ Test image not found. Run: node test-ai-endpoint.js first');
    process.exit(1);
  }

  try {
    // Create form data
    const FormData = (await import('form-data')).default;
    const formData = new FormData();
    formData.append('image', fs.createReadStream(TEST_IMAGE_PATH));

    console.log('📤 Sending request to:', API_URL);
    console.log('📁 Image file:', TEST_IMAGE_PATH);
    console.log('⏱️  Waiting for response (should take ~3 seconds)...\n');

    const startTime = Date.now();

    // Send request
    const response = await fetch(API_URL, {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();

    console.log('✅ Response received!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Status:', response.status);
    console.log('Result:', data.result);
    console.log('Confidence:', `${(data.confidence * 100).toFixed(0)}%`);
    console.log('Processing Time:', `${data.processingTime}ms`);
    console.log('Timestamp:', data.timestamp);
    console.log('Actual Elapsed:', `${elapsed}ms`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    if (response.status === 200) {
      console.log('✅ Test PASSED - Endpoint is working correctly!');
    } else {
      console.log('❌ Test FAILED - Unexpected status code');
    }

  } catch (error) {
    console.error('❌ Test FAILED');
    console.error('Error:', error.message);
    console.log('\n💡 Make sure the server is running:');
    console.log('   cd dermoscanners/server && npm start');
  }
}

testAIEndpoint();
