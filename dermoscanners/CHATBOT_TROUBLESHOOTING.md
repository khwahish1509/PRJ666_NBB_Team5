# Chatbot Troubleshooting Guide

## Common Issues and Solutions

### 🔴 Issue: 500 Internal Server Error

**Symptoms:**
- Chat message fails to send
- Console shows: `Failed to load resource: the server responded with a status of 500`
- Error message in chat: "Sorry, I encountered an error"

**Possible Causes & Solutions:**

#### 1. Missing or Invalid GEMINI_API_KEY

**Check:**
```bash
cd dermoscanners/server
cat .env | grep GEMINI_API_KEY
```

**Solution:**
1. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add to `dermoscanners/server/.env`:
   ```env
   GEMINI_API_KEY=your_actual_api_key_here
   ```
3. Restart the server

**Test the API key:**
```bash
cd dermoscanners/server
node test-gemini-api.js
```

#### 2. Wrong Gemini Model Name

**Check:** The controller should use `gemini-1.5-flash` (not `gemini-2.5-flash`)

**File:** `dermoscanners/server/controllers/chatController.js`
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
```

#### 3. API Quota Exceeded

**Symptoms:**
- Error message mentions quota or rate limit
- Works initially, then stops

**Solution:**
- Check your [Google Cloud Console](https://console.cloud.google.com/) quota
- Wait for quota reset (usually daily)
- Upgrade to paid tier if needed

#### 4. Network/Firewall Issues

**Check:**
```bash
curl "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=YOUR_KEY" \
  -H 'Content-Type: application/json' \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

**Solution:**
- Check firewall settings
- Verify internet connection
- Check proxy settings if behind corporate firewall

---

### 🔴 Issue: 401 Unauthorized

**Symptoms:**
- Chat doesn't load suggestions
- Console shows: `Failed to load resource: the server responded with a status of 401`

**Cause:** User authentication token expired or invalid

**Solution:**
1. Logout from the application
2. Login again
3. Try using the chat

**For Developers:**
- Check JWT token expiration in `server/.env`
- Verify `requireAuth` middleware is working
- Check localStorage for valid auth token

---

### 🔴 Issue: Chat Button Not Appearing

**Symptoms:**
- No blue chat button in bottom-right corner

**Possible Causes:**

#### 1. User Not Logged In
**Solution:** Login to the application

#### 2. Component Not Rendered
**Check:** `dermoscanners/client/src/components/layout/Layout.tsx`
```typescript
{user && <ChatWidget />}
```

**Solution:** Ensure user is authenticated

#### 3. CSS/Z-index Issue
**Check:** Browser DevTools → Elements → Look for ChatWidget
**Solution:** Verify `z-50` class is applied and no other elements have higher z-index

---

### 🔴 Issue: Suggestions Not Loading

**Symptoms:**
- Chat opens but no quick reply buttons appear
- Only welcome message shows

**Possible Causes:**

#### 1. API Endpoint Not Responding
**Check:**
```bash
curl http://localhost:5001/api/chat/suggestions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Solution:**
- Verify server is running
- Check `/api/chat/suggestions` route is registered
- Check server logs for errors

#### 2. Authentication Issue
**Solution:** Same as 401 Unauthorized above

---

### 🔴 Issue: Typing Indicator Stuck

**Symptoms:**
- Typing dots keep animating
- No response appears

**Cause:** API call failed but loading state not cleared

**Solution:**
1. Close and reopen chat
2. Refresh the page
3. Check server logs for errors

**For Developers:**
- Ensure `finally` block sets `isLoading = false`
- Check error handling in `sendMessage` function

---

### 🔴 Issue: Messages Not Scrolling

**Symptoms:**
- New messages appear but don't scroll into view
- Have to manually scroll down

**Solution:**
1. Check `messagesEndRef` is properly set
2. Verify `scrollToBottom()` is called in useEffect
3. Check for CSS overflow issues

**For Developers:**
```typescript
useEffect(() => {
  scrollToBottom();
}, [messages, isTyping]);
```

---

### 🔴 Issue: Chat Layout Broken on Mobile

**Symptoms:**
- Chat window too large
- Elements overlapping
- Can't see input field

**Solution:**
1. Clear browser cache
2. Check viewport meta tag in HTML
3. Verify Tailwind CSS is loaded

**For Developers:**
- Check responsive classes: `max-w-[calc(100vw-3rem)]`
- Test on actual device, not just browser DevTools
- Verify no conflicting CSS

---

## Testing Checklist

### Quick Health Check

1. **Server Running?**
   ```bash
   curl http://localhost:5001/api/health
   ```

2. **Client Running?**
   ```bash
   curl http://localhost:5173
   ```

3. **API Key Valid?**
   ```bash
   cd dermoscanners/server
   node test-gemini-api.js
   ```

4. **User Authenticated?**
   - Check localStorage in browser DevTools
   - Look for `auth` key with valid token

5. **No Console Errors?**
   - Open browser DevTools → Console
   - Should see no red errors

---

## Debug Mode

### Enable Verbose Logging

**Server Side:**
Add to `chatController.js`:
```javascript
console.log('[Chat Debug]', {
  hasApiKey: !!GEMINI_API_KEY,
  messageLength: message?.length,
  historyLength: conversationHistory?.length,
  timestamp: new Date().toISOString()
});
```

**Client Side:**
Add to `ChatWidget.tsx`:
```typescript
console.log('[Chat Debug]', {
  isOpen,
  messagesCount: messages.length,
  isLoading,
  isTyping,
  suggestionsCount: suggestions.length
});
```

---

## Performance Issues

### Chat Slow to Open

**Check:**
- Animation duration (should be 300ms)
- Network latency for suggestions API
- Browser performance

**Solution:**
- Reduce animation duration if needed
- Cache suggestions locally
- Check for memory leaks

### Messages Lag

**Check:**
- Number of messages in state
- Re-render frequency
- Animation performance

**Solution:**
- Limit conversation history to last 50 messages
- Use React.memo for message components
- Optimize scroll behavior

---

## Environment Variables Reference

### Server (.env)
```env
# Required for chat
GEMINI_API_KEY=your_gemini_api_key

# Required for auth
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=15m

# Server config
PORT=5001
NODE_ENV=development
```

### Client (.env)
```env
# Required for API calls
VITE_API_URL=http://localhost:5001/api
```

---

## API Testing

### Test Chat Message Endpoint

```bash
# Get auth token first (login via UI or API)
TOKEN="your_jwt_token_here"

# Test message endpoint
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What is retinol?",
    "conversationHistory": []
  }'
```

### Test Suggestions Endpoint

```bash
curl http://localhost:5001/api/chat/suggestions \
  -H "Authorization: Bearer $TOKEN"
```

---

## Browser-Specific Issues

### Safari
- Check for WebSocket issues
- Verify CSS animations work
- Test on actual iOS device

### Firefox
- Check for fetch API compatibility
- Verify animations are smooth
- Test private browsing mode

### Chrome
- Check for CORS issues
- Verify service workers not interfering
- Test in incognito mode

---

## Getting Help

### Information to Provide

When reporting issues, include:

1. **Error Message**: Exact error from console
2. **Browser**: Name and version
3. **Steps to Reproduce**: What you did before error
4. **Server Logs**: Relevant logs from server console
5. **Environment**: Development or production
6. **API Key Status**: Is it set? (don't share the actual key)

### Useful Commands

```bash
# Check server logs
cd dermoscanners/server
npm start | grep -i chat

# Check client logs
cd dermoscanners/client
npm run dev

# Test API directly
node dermoscanners/server/test-gemini-api.js

# Check environment
cd dermoscanners/server
cat .env | grep -v "SECRET\|KEY" # Safe to share
```

---

## Quick Fixes

### Nuclear Option (Reset Everything)

```bash
# Stop all servers
# Clear browser cache and localStorage
# Then:

cd dermoscanners/server
rm -rf node_modules
npm install
npm start

# In another terminal
cd dermoscanners/client
rm -rf node_modules
npm install
npm run dev

# Login again and test
```

### Just Reset Chat State

```javascript
// In browser console
localStorage.removeItem('chatHistory');
location.reload();
```

---

## Contact & Resources

- **Documentation**: See `CHATBOT_README.md`
- **Architecture**: See `CHATBOT_ARCHITECTURE.md`
- **Testing**: See `CHATBOT_TESTING_GUIDE.md`
- **Gemini API Docs**: https://ai.google.dev/docs
- **React Docs**: https://react.dev

---

**Last Updated**: November 30, 2025
**Version**: 1.0.0
