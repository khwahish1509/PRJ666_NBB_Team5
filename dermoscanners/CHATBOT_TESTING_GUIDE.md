# 🤖 Chatbot Testing Guide

## ✅ Current Status

**Servers Running:**
- Backend: http://localhost:5001 ✅
- Frontend: http://localhost:5173 ✅

**Chatbot Status:**
- UI: ✅ Integrated and working
- Authentication: ✅ Working (401 errors are expected when not logged in)
- API Key: ⚠️ Needs to be added

## 🔐 Step 1: Login First

The chatbot requires authentication. Use these demo credentials:

**Primary Demo User:**
- Email: `sarah.thompson.demo@dermoscanner.com`
- Password: `DemoPass2024!`

**Alternative Test User:**
- Email: `test.user@dermoscanner.com`
- Password: `TestPass2024!`

## 🔑 Step 2: Add Gemini API Key

1. Get your free API key:
   - Visit: https://makersuite.google.com/app/apikey
   - Sign in with Google
   - Click "Create API Key"
   - Copy the key

2. Add to `dermoscanners/server/.env`:
   ```
   GEMINI_API_KEY=AIzaSy...your_actual_key
   ```

3. The server will auto-restart (nodemon is watching)

## 🧪 Step 3: Test the Chatbot

1. **Login** at http://localhost:5173
2. **Look for** the blue chat button (bottom-right corner)
3. **Click** the chat button to open the widget
4. **Try these questions:**
   - "What's the best skincare routine for dry skin?"
   - "How often should I use sunscreen?"
   - "What causes acne?"
   - "Explain the difference between moisturizer and serum"

## 🎯 Expected Behavior

### Before Login (401 Errors - Normal!)
```
POST http://localhost:5001/api/chat/message 401 (Unauthorized)
```
This is correct! The chatbot requires authentication.

### After Login (Should Work)
- Chat button appears in bottom-right
- Click opens chat window
- Welcome message displays
- Suggested questions appear
- Can send messages and get AI responses

### Without API Key
```json
{
  "error": "Chatbot service not configured. Please add GEMINI_API_KEY to environment variables."
}
```
This means you need to add your Gemini API key.

### With API Key (Success!)
- Messages send successfully
- AI responds with skincare advice
- Conversation history maintained
- Smooth chat experience

## 🐛 Troubleshooting

### Chat Button Not Showing
- Make sure you're logged in
- Check browser console for errors
- Refresh the page

### 401 Unauthorized Errors
- This is normal before login
- Login with demo credentials
- Token should be stored in localStorage

### "Chatbot service not configured"
- Add GEMINI_API_KEY to server/.env
- Wait for nodemon to restart server
- Try sending message again

### No Response from Chatbot
- Check server logs for errors
- Verify API key is correct
- Check Gemini API quota (15 req/min, 1500/day)

## 📊 Testing Checklist

- [ ] Both servers running
- [ ] Can access http://localhost:5173
- [ ] Can login with demo credentials
- [ ] Chat button appears after login
- [ ] Chat window opens when clicked
- [ ] Welcome message displays
- [ ] Suggested questions appear
- [ ] Can send a message
- [ ] Receives AI response
- [ ] Conversation history works
- [ ] Can close and reopen chat
- [ ] Chat persists across page navigation

## 🎨 UI Features to Test

- [ ] Floating chat button (blue, bottom-right)
- [ ] Chat window opens smoothly
- [ ] Messages display correctly (user vs assistant)
- [ ] Suggested questions are clickable
- [ ] Loading indicator shows while waiting
- [ ] Auto-scroll to latest message
- [ ] Input field and send button work
- [ ] Close button works
- [ ] Responsive design (try resizing window)

## 💡 Sample Conversations

### Test 1: Basic Skincare Question
**You:** "What's the best skincare routine for dry skin?"
**Expected:** Detailed routine with cleanser, moisturizer, sunscreen recommendations

### Test 2: Product Question
**You:** "What ingredients should I look for in anti-aging products?"
**Expected:** List of ingredients like retinol, vitamin C, hyaluronic acid

### Test 3: Medical Disclaimer
**You:** "I have a suspicious mole, what should I do?"
**Expected:** Advice to consult a dermatologist (not medical diagnosis)

### Test 4: Follow-up Question
**You:** "What's the best sunscreen?"
**Bot:** [Responds about sunscreen]
**You:** "How often should I reapply it?"
**Expected:** Bot remembers context and answers about reapplication

## 🚀 Next Steps

Once basic testing works:
1. Test on different pages (dashboard, scan, history)
2. Test conversation memory (multiple messages)
3. Test suggested questions
4. Test error handling (disconnect internet)
5. Test with multiple users
6. Test rate limiting (send many messages quickly)

## 📝 Notes

- The chatbot is visible on ALL pages after login
- It's a floating widget that follows you around
- Conversation history is maintained during the session
- Each user has their own chat session
- Free tier: 15 requests/minute, 1500/day

---

**Ready to test?** Login and look for the blue chat button! 💬
