# Chatbot API Key Setup Guide

## ⚠️ IMPORTANT: API Key Leaked

The current GEMINI_API_KEY in the `.env` file has been reported as leaked and is now blocked by Google.

**Error message:**
```
Your API key was reported as leaked. Please use another API key.
```

## 🔑 How to Get a New API Key

### Step 1: Go to Google AI Studio
Visit: https://makersuite.google.com/app/apikey

### Step 2: Create New API Key
1. Click "Create API Key"
2. Select your Google Cloud project (or create a new one)
3. Click "Create API key in existing project" or "Create API key in new project"
4. Copy the generated API key

### Step 3: Update Environment Variable

**File:** `dermoscanners/server/.env`

Replace the old key with your new key:
```env
GEMINI_API_KEY=your_new_api_key_here
```

### Step 4: Restart the Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd dermoscanners/server
npm start
```

### Step 5: Test the API Key
```bash
cd dermoscanners/server
node test-gemini-api.js
```

You should see:
```
✅ Success!
Response: Hello, I am working! ...
Gemini API is working correctly!
```

---

## 🔒 Security Best Practices

### DO NOT Commit API Keys to Git

**Check if your key is exposed:**
```bash
git log --all -p | grep "GEMINI_API_KEY"
```

**If you find your key in git history:**
1. Generate a new API key immediately
2. Use `git-filter-repo` or BFG Repo-Cleaner to remove it from history
3. Force push to remote (if applicable)

### Use Environment Variables

✅ **GOOD:**
```env
# .env file (in .gitignore)
GEMINI_API_KEY=your_key_here
```

❌ **BAD:**
```javascript
// Hardcoded in code
const API_KEY = "AIzaSyCmMx1yqqpwoTdA4hL_LEr2ZTgRiy5iuf0";
```

### Add .env to .gitignore

**File:** `.gitignore`
```
.env
.env.local
.env.*.local
```

### Use .env.example for Documentation

**File:** `dermoscanners/server/.env.example`
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 🧪 Testing Your Setup

### Test 1: Check API Key is Set
```bash
cd dermoscanners/server
cat .env | grep GEMINI_API_KEY
```

Should show your key (not empty).

### Test 2: Test API Connection
```bash
cd dermoscanners/server
node test-gemini-api.js
```

Should show success message.

### Test 3: List Available Models
```bash
cd dermoscanners/server
node list-gemini-models.js
```

Should list all available Gemini models.

### Test 4: Test in Application
1. Start server: `cd dermoscanners/server && npm start`
2. Start client: `cd dermoscanners/client && npm run dev`
3. Login to the application
4. Click chat button
5. Send a message

---

## 📋 Current Configuration

### Correct Model Name
```javascript
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
```

### Available Models (as of Nov 2025)
- ✅ `gemini-2.5-flash` (Recommended - Fast and efficient)
- ✅ `gemini-2.5-pro` (More capable, slower)
- ✅ `gemini-flash-latest` (Always latest flash version)
- ✅ `gemini-pro-latest` (Always latest pro version)

### Why gemini-2.5-flash?
- Fast response times (1-2 seconds)
- Good quality responses
- Cost-effective
- Supports conversation history
- Perfect for chatbot use case

---

## 🐛 Troubleshooting

### Error: "API key not found"
**Solution:** Make sure GEMINI_API_KEY is set in `.env` file

### Error: "API key was reported as leaked"
**Solution:** Generate a new API key (see steps above)

### Error: "models/gemini-xxx is not found"
**Solution:** Use correct model name: `gemini-2.5-flash`

### Error: "Quota exceeded"
**Solution:** 
- Wait for quota reset (usually daily)
- Check your quota in Google Cloud Console
- Upgrade to paid tier if needed

### Error: "403 Forbidden"
**Solution:**
- Check API key is valid
- Ensure API key has correct permissions
- Verify Generative Language API is enabled in Google Cloud

---

## 💰 Pricing Information

### Free Tier (as of Nov 2025)
- 15 requests per minute
- 1,500 requests per day
- 1 million tokens per day

### Paid Tier
- Higher rate limits
- More requests per day
- Better SLA

**Check current pricing:** https://ai.google.dev/pricing

---

## 🔗 Useful Links

- **Get API Key:** https://makersuite.google.com/app/apikey
- **API Documentation:** https://ai.google.dev/docs
- **Pricing:** https://ai.google.dev/pricing
- **Google Cloud Console:** https://console.cloud.google.com/
- **API Status:** https://status.cloud.google.com/

---

## ✅ Checklist

Before using the chatbot:

- [ ] Generated new API key from Google AI Studio
- [ ] Added key to `dermoscanners/server/.env`
- [ ] Verified `.env` is in `.gitignore`
- [ ] Tested with `node test-gemini-api.js`
- [ ] Restarted the server
- [ ] Tested in the application

---

## 📞 Need Help?

If you're still having issues:

1. Check `CHATBOT_TROUBLESHOOTING.md`
2. Run `node test-gemini-api.js` and share the output
3. Check server logs for errors
4. Verify API key is valid in Google AI Studio

---

**Last Updated:** November 30, 2025
**Status:** API Key needs to be regenerated
