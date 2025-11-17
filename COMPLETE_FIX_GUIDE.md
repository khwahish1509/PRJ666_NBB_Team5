# Complete Fix Guide - Recommendations & Server Issues

## Issues Identified

### 1. Recommendations Not Showing
- ✅ **Fixed**: API endpoint corrected to `/ai/recommendations`
- ✅ **Fixed**: JSON structure updated to match component expectations

### 2. Server Connection Issues
- ❌ **Issue**: Server might not be running on port 5001
- ❌ **Issue**: 401 Unauthorized errors on `/api/history`

## Step-by-Step Fix

### Step 1: Start the Server

```bash
# Navigate to server directory
cd dermoscanners/server

# Install dependencies (if not already done)
npm install

# Start the server
npm start
```

**Expected Output**:
```
API running on port 5001
MongoDB connected successfully
```

### Step 2: Start the Client

```bash
# Open a new terminal
# Navigate to client directory
cd dermoscanners/client

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

**Expected Output**:
```
VITE v4.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Step 3: Test the Recommendations

1. Open browser to `http://localhost:5173`
2. Log in (or register if needed)
3. Navigate to Scan page
4. Upload an image
5. Wait for AI analysis (3 seconds)
6. **Verify**: ResultCard displays
7. **Verify**: RecommendationPanel displays below with health tips

## Troubleshooting

### Issue: "Recommendations Temporarily Unavailable"

**Possible Causes**:
1. Server not running
2. Wrong port configuration
3. CORS issues
4. recommendations.json file missing or corrupted

**Solution**:
```bash
# Check if server is running
curl http://localhost:5001/api/health

# Should return: {"status":"ok"}

# Test recommendations endpoint
curl http://localhost:5001/api/ai/recommendations

# Should return JSON with recommendations
```

### Issue: 401 Unauthorized on /api/history

**Cause**: The `/api/history` endpoint requires authentication

**Solution**: Make sure you're logged in

```bash
# Check if you have a valid token
# Open browser console and run:
localStorage.getItem('auth')

# Should return an object with tokens
```

If no token, you need to log in:
1. Go to `/login`
2. Enter credentials
3. After successful login, try again

### Issue: Server Won't Start

**Possible Causes**:
1. Port 5001 already in use
2. MongoDB connection failed
3. Missing environment variables

**Solutions**:

**Check if port is in use**:
```bash
# On Mac/Linux
lsof -i :5001

# On Windows
netstat -ano | findstr :5001
```

**Kill process using port**:
```bash
# On Mac/Linux
kill -9 <PID>

# On Windows
taskkill /PID <PID> /F
```

**Check MongoDB connection**:
```bash
# Test MongoDB connection
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb+srv://team5:team5@cluster0.wp263v2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => console.log('Connected!')).catch(err => console.error('Error:', err));"
```

## Configuration Files

### Client .env (`dermoscanners/client/.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

### Server .env (`dermoscanners/server/.env`)
```env
NODE_ENV=development
PORT=5001
MONGO_URI=mongodb+srv://team5:team5@cluster0.wp263v2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=f31b7be6a9394c3fab689ee8ce429440bfa22dae2fd0476590481617e1c4a6fe
CLIENT_URL=http://localhost:5173
```

## API Endpoints Reference

### Public Endpoints (No Auth Required)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/ai/analyze` - Analyze skin lesion image
- `GET /api/ai/recommendations` - Get health recommendations
- `GET /api/health` - Health check

### Protected Endpoints (Auth Required)
- `GET /api/history` - Get scan history
- `POST /api/scans` - Save scan result
- `GET /api/scans` - Get user scans
- `DELETE /api/scans/:id` - Delete scan
- `GET /api/profile` - Get user profile

## Testing Checklist

### Server Tests
- [ ] Server starts without errors
- [ ] MongoDB connects successfully
- [ ] Health endpoint responds: `curl http://localhost:5001/api/health`
- [ ] Recommendations endpoint responds: `curl http://localhost:5001/api/ai/recommendations`

### Client Tests
- [ ] Client starts without errors
- [ ] Can access login page
- [ ] Can register new user
- [ ] Can log in successfully
- [ ] Can navigate to Scan page
- [ ] Can upload image
- [ ] ResultCard displays after 3 seconds
- [ ] RecommendationPanel displays with tips
- [ ] Can view scan history
- [ ] Can download backup

## Quick Test Script

Create a file `test-recommendations.sh`:

```bash
#!/bin/bash

echo "Testing DermoScanner Recommendations..."
echo ""

# Test 1: Health check
echo "1. Testing health endpoint..."
HEALTH=$(curl -s http://localhost:5001/api/health)
if [[ $HEALTH == *"ok"* ]]; then
  echo "✅ Health check passed"
else
  echo "❌ Health check failed"
  echo "Response: $HEALTH"
fi

echo ""

# Test 2: Recommendations endpoint
echo "2. Testing recommendations endpoint..."
RECS=$(curl -s http://localhost:5001/api/ai/recommendations)
if [[ $RECS == *"recommendations"* ]]; then
  echo "✅ Recommendations endpoint working"
  echo "Sample response:"
  echo $RECS | python3 -m json.tool | head -20
else
  echo "❌ Recommendations endpoint failed"
  echo "Response: $RECS"
fi

echo ""
echo "Testing complete!"
```

Run it:
```bash
chmod +x test-recommendations.sh
./test-recommendations.sh
```

## Expected Recommendations Response

```json
{
  "version": "1.0",
  "recommendations": {
    "benign": {
      "title": "Low Risk - Benign",
      "tips": [
        "Continue regular skin self-examinations monthly",
        "Protect your skin from sun exposure with SPF 30+ sunscreen",
        "Monitor the area for any changes in size, color, or texture",
        "Maintain a healthy lifestyle with balanced diet and hydration",
        "Schedule routine dermatology check-ups annually"
      ]
    },
    "suspicious": {
      "title": "Moderate Risk - Suspicious",
      "tips": [
        "Schedule an appointment with a dermatologist within 2-4 weeks",
        "Document the lesion with photos to track any changes",
        "Avoid sun exposure and use high SPF sunscreen on the area",
        "Do not attempt to remove or treat the lesion yourself",
        "Bring this scan result to your dermatology appointment"
      ]
    },
    "malignant": {
      "title": "High Risk - Malignant",
      "tips": [
        "Seek immediate medical attention from a dermatologist",
        "Schedule an appointment within 1 week or visit urgent care",
        "Bring this scan result and any previous medical records",
        "Avoid further sun exposure to the affected area",
        "Do not delay - early detection significantly improves outcomes"
      ]
    }
  }
}
```

## Common Errors & Solutions

### Error: "ECONNREFUSED"
**Cause**: Server not running  
**Solution**: Start the server with `npm start`

### Error: "401 Unauthorized"
**Cause**: Trying to access protected endpoint without auth  
**Solution**: Log in first, or check if endpoint should be public

### Error: "CORS policy"
**Cause**: CORS not configured correctly  
**Solution**: Check `CLIENT_URL` in server `.env` matches client URL

### Error: "Cannot find module"
**Cause**: Dependencies not installed  
**Solution**: Run `npm install` in both client and server directories

### Error: "Port already in use"
**Cause**: Another process using port 5001  
**Solution**: Kill the process or change port in `.env`

## Success Indicators

When everything is working correctly, you should see:

### In Server Console:
```
API running on port 5001
MongoDB connected successfully
```

### In Client Console (Browser DevTools):
```
No errors
Successful API calls to /api/ai/recommendations
```

### In Browser:
- ✅ Scan page loads
- ✅ Image upload works
- ✅ ResultCard displays with gradient UI
- ✅ RecommendationPanel displays with health tips
- ✅ Beautiful animations and transitions
- ✅ No error messages

---

**Last Updated**: [Current Date]  
**Status**: Ready for Testing  
**Next Steps**: Start server, start client, test recommendations
