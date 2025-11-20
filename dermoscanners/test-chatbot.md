# Quick Chatbot Test

## ✅ What I Built

1. **Backend (Node.js/Express)**
   - `/api/chat/message` - Send messages to Gemini AI
   - `/api/chat/suggestions` - Get suggested questions
   - Smart system prompt for skincare context
   - Conversation history support

2. **Frontend (React/TypeScript)**
   - Floating chat button (bottom-right)
   - Beautiful chat interface
   - Message history
   - Suggested questions
   - Loading states
   - Auto-scroll

3. **Integration**
   - Added to Layout component (shows on all pages)
   - Only visible when user is logged in
   - Uses existing authentication

## 🚀 To Start Using:

1. **Get API Key** (2 minutes)
   - Visit: https://makersuite.google.com/app/apikey
   - Click "Create API Key"
   - Copy it

2. **Add to .env** (30 seconds)
   ```bash
   # In dermoscanners/server/.env
   GEMINI_API_KEY=your_actual_key_here
   ```

3. **Start servers** (if not running)
   ```bash
   # Terminal 1
   cd dermoscanners/server
   npm run dev

   # Terminal 2
   cd dermoscanners/client
   npm run dev
   ```

4. **Test it!**
   - Login to your app
   - Look for blue chat button (bottom-right)
   - Click and ask: "What's the best skincare routine?"

## 💰 Cost: FREE

- 15 requests/minute
- 1,500 requests/day
- No credit card needed

## 🎯 What It Can Do

- Answer skincare questions
- Explain skin conditions
- Recommend product types
- Provide skincare tips
- Remember conversation context
- Give medical disclaimers

## 📝 Example Questions to Try

1. "What's the best skincare routine for dry skin?"
2. "How often should I use sunscreen?"
3. "What causes acne?"
4. "Explain the difference between moisturizer and serum"
5. "What ingredients help with aging?"

---

**That's it!** The chatbot is fully integrated and ready to use. Just add your API key and start chatting! 🎉
