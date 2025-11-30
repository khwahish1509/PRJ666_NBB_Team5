// Quick test script for Gemini API
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

console.log('Testing Gemini API...');
console.log('API Key present:', !!GEMINI_API_KEY);
console.log('API Key length:', GEMINI_API_KEY?.length || 0);

if (!GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY not found in environment variables');
  process.exit(1);
}

async function testGeminiAPI() {
  try {
    console.log('\nSending test request...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Say "Hello, I am working!" in a friendly way.'
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 100,
        }
      })
    });

    console.log('Response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error' }));
      console.error('❌ API Error:', JSON.stringify(errorData, null, 2));
      process.exit(1);
    }

    const data = await response.json();
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    console.log('\n✅ Success!');
    console.log('Response:', botResponse);
    console.log('\nGemini API is working correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testGeminiAPI();
