# Gemini Chatbot Setup Guide

## 🎉 Your chatbot is ready! Just need the API key.

### Step 1: Get Your Free Gemini API Key

1. Go to: https://makersuite.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key

### Step 2: Add API Key to Server

Open `dermoscanners/server/.env` and replace:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

With your actual key:
```
GEMINI_API_KEY=AIzaSy...your_actual_key
```

### Step 3: Start Your Servers

**Terminal 1 - Backend:**
```bash
cd dermoscanners/server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd dermoscanners/client
npm run dev
```

### Step 4: Test the Chatbot

1. Open your app at http://localhost:5173
2. Login to your account
3. Look for the blue chat button in the bottom-right corner
4. Click it and start chatting!

## 🎯 Features

- **Floating chat widget** - Always accessible from any page
- **Skincare expertise** - Answers questions about skin health, products, routines
- **Conversation memory** - Remembers context from previous messages
- **Suggested questions** - Quick start prompts for users
- **Medical disclaimers** - Reminds users to consult professionals
- **Smart responses** - Powered by Google's Gemini AI

## 💡 Try These Questions

- "What's the best skincare routine for dry skin?"
- "How often should I use sunscreen?"
- "What causes acne and how can I prevent it?"
- "Explain my scan results"
- "What ingredients should I look for in moisturizers?"

## 🔒 Security

- API key stored securely on backend only
- User authentication required
- Rate limiting applied
- No sensitive data stored in chat history

## 📊 Free Tier Limits

- 15 requests per minute
- 1,500 requests per day
- More than enough for testing and demos!

## 🚀 Next Steps (Optional)

Want to enhance the chatbot? You can:
- Add product recommendations from your database
- Include user's scan history in context
- Add image analysis capabilities
- Store chat history in MongoDB
- Add typing indicators and animations

## ⚠️ Important Notes

- The chatbot provides general information only
- Always includes medical disclaimers
- Does not diagnose conditions
- Recommends consulting dermatologists for serious concerns

---

**Need help?** The chatbot is fully integrated and ready to use once you add your API key!
