// Use native fetch (available in Node 18+)
const fetch = globalThis.fetch;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// System prompt for the chatbot
const SYSTEM_CONTEXT = `You are a helpful skincare assistant for DermoScanners, a skin analysis application. 
Your role is to:
- Answer general skincare questions
- Explain skin conditions in simple terms
- Provide skincare tips and advice
- Recommend appropriate product types (moisturizers, cleansers, sunscreens, etc.)

IMPORTANT DISCLAIMERS:
- You are NOT a doctor and cannot diagnose medical conditions
- Always recommend consulting a dermatologist for serious concerns
- Provide general information only, not medical advice

Be friendly, concise, and helpful. Keep responses under 150 words unless more detail is requested.`;

export const sendMessage = async (req, res) => {
  // Read API key at runtime, not at module load time
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  
  console.log('[Chat] Received message request');
  console.log('[Chat] API Key present:', !!GEMINI_API_KEY);
  console.log('[Chat] API Key length:', GEMINI_API_KEY?.length || 0);
  
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!GEMINI_API_KEY) {
      return res.status(500).json({ 
        error: 'Chatbot service not configured. Please add GEMINI_API_KEY to environment variables.' 
      });
    }

    // Build conversation context
    let conversationText = SYSTEM_CONTEXT + '\n\n';
    
    // Add recent conversation history (last 5 messages)
    const recentHistory = conversationHistory.slice(-5);
    recentHistory.forEach(msg => {
      conversationText += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
    });
    
    conversationText += `User: ${message}\nAssistant:`;

    // Call Gemini API
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: conversationText
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
      console.error('Gemini API error:', {
        status: response.status,
        statusText: response.statusText,
        errorData
      });
      return res.status(500).json({ 
        error: 'Failed to get response from chatbot service',
        details: errorData.error?.message || `API returned ${response.status}: ${response.statusText}`
      });
    }

    const data = await response.json();
    
    // Extract the response text
    const botResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 
                       'I apologize, but I could not generate a response. Please try again.';

    res.json({
      response: botResponse.trim(),
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      error: 'An error occurred while processing your message',
      details: error.message 
    });
  }
};

// Get suggested questions with variety
export const getSuggestedQuestions = (req, res) => {
  const allSuggestions = [
    // Product safety
    "Is this product safe for sensitive skin?",
    "What ingredients should I avoid?",
    "Can I use this during pregnancy?",
    
    // Ingredient questions
    "Explain harmful ingredients in skincare",
    "What are the benefits of hyaluronic acid?",
    "Is retinol safe for daily use?",
    
    // Comparison
    "Compare moisturizer vs serum",
    "What's better: chemical or physical sunscreen?",
    "Compare different acne treatments",
    
    // Routines
    "What's the best skincare routine for dry skin?",
    "How to build a morning skincare routine?",
    "What's the correct order to apply products?",
    
    // Specific concerns
    "How can I reduce dark circles?",
    "What causes acne and how to prevent it?",
    "How to fade hyperpigmentation?",
    "Best products for anti-aging",
    
    // General advice
    "How often should I use sunscreen?",
    "When should I see a dermatologist?",
    "How to identify my skin type?"
  ];

  // Randomly select 6 suggestions for variety
  const shuffled = allSuggestions.sort(() => 0.5 - Math.random());
  const suggestions = shuffled.slice(0, 6);

  res.json({ suggestions });
};
