/**
 * Simple test script to verify AI endpoint functionality
 * Creates a minimal test image buffer and sends it to the endpoint
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a minimal valid JPEG file (1x1 pixel)
// This is a base64-encoded minimal JPEG image
const minimalJpegBase64 = '/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwAA8A/9k=';

const testImageBuffer = Buffer.from(minimalJpegBase64, 'base64');
const testImagePath = path.join(__dirname, 'test-image.jpg');

// Write test image to file
fs.writeFileSync(testImagePath, testImageBuffer);

console.log('✓ Test image created at:', testImagePath);
console.log('✓ Image size:', testImageBuffer.length, 'bytes');
console.log('\nTo test the AI endpoint, run:');
console.log(`curl -X POST http://localhost:5001/api/ai/analyze -F "image=@${testImagePath}"`);
console.log('\nOr start the server and use the test image for manual testing.');
