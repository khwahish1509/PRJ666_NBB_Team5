# Testing Guide for AI Endpoint

## Quick Start

### Step 1: Install Dependencies & Start Server
```bash
cd dermoscanners/server
npm install
npm start
```

The server should start on `http://localhost:5001`

---

## Testing Methods

### Method 1: Visual Browser Test (Easiest) ⭐

1. Make sure the server is running
2. Open `test-frontend.html` in your browser:
   ```bash
   open test-frontend.html
   # or just double-click the file
   ```
3. Upload any image (JPEG, PNG, or WebP)
4. Click "Analyze Image"
5. Wait ~3 seconds for the mock result

**What you should see:**
- Result: benign, suspicious, or malignant (random)
- Confidence: 60-95% (varies by result type)
- Processing time: ~3000ms
- Timestamp

---

### Method 2: Command Line Test

```bash
# Generate test image first
node test-ai-endpoint.js

# Test with curl
curl -X POST http://localhost:5001/api/ai/analyze \
  -F "image=@test-image.jpg"
```

**Expected response:**
```json
{
  "result": "benign",
  "confidence": 0.87,
  "processingTime": 3002,
  "timestamp": "2024-11-11T19:30:45.123Z"
}
```

---

### Method 3: Automated Test Script

```bash
node manual-test.js
```

This will automatically test the endpoint and show results in the terminal.

---

## Testing Different Scenarios

### ✅ Valid Image Upload
- Upload JPEG, PNG, or WebP under 5MB
- Should return 200 with analysis result

### ❌ No File
```bash
curl -X POST http://localhost:5001/api/ai/analyze
```
Expected: `400 - "No image file provided"`

### ❌ Invalid File Type
Upload a .txt or .pdf file
Expected: `400 - "Invalid file type. Only JPEG, PNG, and WebP are supported."`

### ❌ File Too Large
Upload an image over 5MB
Expected: `400 - "File size exceeds 5MB limit"`

---

## How This Connects to Frontend (Tasks 2-4)

The frontend will use this endpoint like this:

```typescript
// In ScanPage.tsx (Task 2)
const formData = new FormData();
formData.append('image', imageFile);

const response = await fetch('http://localhost:5001/api/ai/analyze', {
  method: 'POST',
  body: formData
});

const data = await response.json();
// { result: "benign", confidence: 0.87, ... }
```

**Frontend Flow:**
1. User uploads image on ScanPage
2. Frontend sends to `/api/ai/analyze`
3. Shows loading state for ~3 seconds
4. Displays result with confidence score
5. Saves to scan history

---

## Troubleshooting

### Server won't start
```bash
# Check if port 5001 is in use
lsof -i :5001

# Kill process if needed
kill -9 <PID>
```

### "Cannot find module 'multer'"
```bash
cd dermoscanners/server
npm install
```

### CORS errors in browser
The server is configured to allow all origins (`*`). If you still see CORS errors, check that the server is running on port 5001.

### Connection refused
Make sure:
1. Server is running (`npm start`)
2. Using correct URL: `http://localhost:5001/api/ai/analyze`
3. MongoDB is connected (check server logs)

---

## Next Steps

Once this endpoint is working:
1. ✅ Task 1: Mock AI API endpoint (DONE)
2. ⏭️ Task 2: Create ScanPage component with image upload
3. ⏭️ Task 3: Integrate API call and display results
4. ⏭️ Task 4: Add scan history functionality

The frontend tasks will build the UI that calls this endpoint!
