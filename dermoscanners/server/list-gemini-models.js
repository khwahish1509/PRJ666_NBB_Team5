// List available Gemini models
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

console.log('Listing available Gemini models...\n');

async function listModels() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`
    );

    if (!response.ok) {
      console.error('Error:', response.status, response.statusText);
      const error = await response.json();
      console.error(JSON.stringify(error, null, 2));
      return;
    }

    const data = await response.json();
    
    console.log('Available models:\n');
    data.models?.forEach(model => {
      console.log(`Name: ${model.name}`);
      console.log(`Display Name: ${model.displayName}`);
      console.log(`Supported Methods: ${model.supportedGenerationMethods?.join(', ')}`);
      console.log('---');
    });

    // Find models that support generateContent
    const contentModels = data.models?.filter(m => 
      m.supportedGenerationMethods?.includes('generateContent')
    );

    console.log('\n✅ Models supporting generateContent:');
    contentModels?.forEach(model => {
      console.log(`  - ${model.name}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
  }
}

listModels();
