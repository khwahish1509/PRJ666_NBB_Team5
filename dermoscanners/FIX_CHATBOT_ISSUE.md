# Chatbot Issue - RESOLVED

## Problem
Your chatbot is returning a 500 error because **your Gemini API key has been reported as leaked and blocked by Google**.

## Error Details
```
{
  "error": {
    "code": 403,
    "message": "Your API key was reported as leaked. Please use another API key.",
    "status": "PERMISSION_DENIED"
  }
}
```

## Solution

### Step 1: Get a New API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Delete the old compromised key
3. Create a new API key
4. **IMPORTANT**: Keep this key private and never commit it to Git

### Step 2: Update Your .env File
Replace the old key in `dermoscanners/server/.env`:

```env
GEMINI_API_KEY=YOUR_NEW_API_KEY_HERE
```

### Step 3: Restart Your Server
```bash
cd dermoscanners/server
# Stop the current server (Ctrl+C)
npm start
```

### Step 4: Protect Your API Keys
Add these to your `.gitignore` (should already be there):
```
.env
.env.local
.env.*.local
```

### Step 5: Remove Exposed Keys from Git History
If you've committed the key to Git, you need to:
1. Remove it from Git history using `git filter-branch` or BFG Repo-Cleaner
2. Force push to remote repository
3. Rotate ALL exposed credentials

## Prevention
- Never commit `.env` files
- Use `.env.example` with placeholder values
- Consider using environment variable management tools
- Enable secret scanning on your repository

## Testing After Fix
Once you have a new key:
```bash
# Test the API directly
curl -X POST "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=YOUR_NEW_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"parts":[{"text":"Hello"}]}]}'
```

If you see a proper response (not a 403 error), your chatbot will work!
