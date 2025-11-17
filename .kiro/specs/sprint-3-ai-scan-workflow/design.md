# Design Document

## Overview

This design document outlines the implementation approach for Sprint 3 of the DermoScanner application. The sprint delivers a complete AI-powered skin lesion scanning workflow with mock AI integration, real-time result visualization, persistent data storage, cloud synchronization, and production deployment. The design prioritizes clean, readable code with minimal complexity while ensuring all features are demo-ready and provide clear user value.

### Design Principles

1. **Simplicity First**: Use straightforward implementations without over-engineering
2. **Reuse Existing Infrastructure**: Leverage current Express/React architecture
3. **Progressive Enhancement**: Build features incrementally with clear integration points
4. **Demo-Driven Development**: Ensure every feature has visible, testable outcomes
5. **Minimal Dependencies**: Avoid adding unnecessary libraries

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React + Vite)                    │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │  ScanPage.tsx  │  │ ResultCard   │  │ RecommendPanel  │ │
│  │  (Upload UI)   │→ │ (Display)    │→ │ (Tips)          │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│           ↓                                      ↑           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         LocalStorage + Backup Manager                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   Server (Express + Node.js)                 │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────────┐ │
│  │ /api/analyze   │  │ /api/scans   │  │ /api/backup     │ │
│  │ (Mock AI)      │  │ (CRUD)       │  │ (Export)        │ │
│  └────────────────┘  └──────────────┘  └─────────────────┘ │
│           ↓                  ↓                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              MongoDB Atlas (Cloud DB)                  │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express 4, Mongoose
- **Database**: MongoDB Atlas
- **Deployment**: Render (backend) + Vercel (frontend) or Render (monorepo)
- **Testing**: Vitest (unit), Manual QA (integration)

## Components and Interfaces

### 1. Mock AI API Endpoint

**Location**: `dermoscanners/server/routes/aiRoutes.js`

**Purpose**: Simulate AI model inference without requiring a trained model

**Implementation**:
```javascript
// POST /api/ai/analyze
// Request: multipart/form-data with 'image' field
// Response: { result, confidence, processing_time, timestamp }
```

**Key Features**:
- File validation (JPEG, PNG, WebP only, max 5MB)
- 3-second simulated delay using `setTimeout`
- Random confidence score (0.75-0.95 for benign, 0.60-0.85 for suspicious)
- Error handling for invalid uploads

**Controller Logic**:
```javascript
export const analyzeImage = async (req, res) => {
  // 1. Validate file exists and format
  // 2. Simulate 3-second processing
  // 3. Generate mock result based on random selection
  // 4. Return JSON response
}
```

### 2. Result Card Component

**Location**: `dermoscanners/client/src/components/scan/ResultCard.tsx`

**Purpose**: Display scan results with visual confidence meter

**Props Interface**:
```typescript
interface ResultCardProps {
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  processingTime: number;
  timestamp: string;
}
```

**Visual Elements**:
- Classification badge (color-coded: green/yellow/red)
- Confidence progress bar (0-100%)
- Processing time indicator
- Timestamp display
- Fade-in animation (300ms)

**Responsive Design**:
- Desktop: Card width 600px, horizontal layout
- Tablet: Card width 100%, vertical layout
- Mobile: Stacked elements, larger touch targets

### 3. Recommendation Panel Component

**Location**: `dermoscanners/client/src/components/scan/RecommendationPanel.tsx`

**Purpose**: Display health tips based on scan result

**Data Source**: `dermoscanners/server/data/recommendations.json`

**JSON Structure**:
```json
{
  "version": "1.0",
  "recommendations": {
    "benign": {
      "title": "Low Risk Detected",
      "tips": [
        "Continue regular skin monitoring",
        "Use SPF 30+ sunscreen daily",
        "Schedule annual dermatology checkup"
      ]
    },
    "suspicious": {
      "title": "Moderate Risk - Consult Doctor",
      "tips": [
        "Schedule appointment with dermatologist within 2 weeks",
        "Document any changes in size or color",
        "Avoid sun exposure on affected area"
      ]
    },
    "malignant": {
      "title": "High Risk - Immediate Action Required",
      "tips": [
        "Contact dermatologist immediately",
        "Do not delay medical consultation",
        "Bring scan history to appointment"
      ]
    }
  }
}
```

**Fallback Behavior**:
- If JSON fetch fails, display: "Recommendations temporarily unavailable. Please consult a healthcare professional."

### 4. Scan History Storage

**Dual Storage Strategy**:

**LocalStorage** (Client-side):
- Key: `dermoscanner_history`
- Format: JSON array of scan objects
- Max size: 5MB (browser limit)
- Purpose: Instant access, offline capability

**MongoDB** (Server-side):
- Collection: `scans`
- Schema: See Data Models section
- Purpose: Persistent backup, cross-device sync

**Storage Flow**:
```
1. Scan completes → Save to localStorage immediately
2. API call to POST /api/scans → Save to MongoDB
3. On page load → Fetch from localStorage (fast)
4. Background sync → Fetch from MongoDB (authoritative)
```

### 5. Backup Manager

**Location**: `dermoscanners/client/src/utils/backupManager.ts`

**Functions**:

```typescript
// Download all scans as JSON file
export const downloadBackup = (scans: Scan[]): void => {
  const blob = new Blob([JSON.stringify(scans, null, 2)], { 
    type: 'application/json' 
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `dermoscanner-backup-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

// Restore scans from uploaded JSON file
export const restoreBackup = (file: File): Promise<Scan[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const scans = JSON.parse(e.target.result as string);
        resolve(scans);
      } catch (error) {
        reject(new Error('Invalid backup file'));
      }
    };
    reader.readAsText(file);
  });
}
```

### 6. MongoDB Integration

**Connection Setup**:
- Use existing `connectDatabase()` function from `config/db.js`
- Connection string from `.env`: `MONGO_URI`
- Connection pooling: Default Mongoose settings (5 connections)

**CRUD Operations**:

```javascript
// Create scan
POST /api/scans
Body: { userId, result, confidence, imageUrl, timestamp }

// Read user scans
GET /api/scans?userId=xxx

// Update scan (add notes)
PATCH /api/scans/:id
Body: { notes }

// Delete scan
DELETE /api/scans/:id
```

**Error Handling**:
- Connection timeout: 10 seconds
- Retry logic: 3 attempts with exponential backoff
- Offline mode: Queue operations in localStorage, sync when online

### 7. Deployment Configuration

**Monorepo Structure** (Recommended):
```
dermoscanners/
├── client/          # Frontend (Vite build)
├── server/          # Backend (Express)
├── package.json     # Root scripts
└── render.yaml      # Deployment config
```

**Render Configuration** (`render.yaml`):
```yaml
services:
  - type: web
    name: dermoscanner-api
    env: node
    buildCommand: cd server && npm install
    startCommand: cd server && npm start
    envVars:
      - key: MONGO_URI
        sync: false
      - key: JWT_SECRET
        sync: false
      - key: CLIENT_URL
        value: https://dermoscanner.vercel.app

  - type: web
    name: dermoscanner-client
    env: static
    buildCommand: cd client && npm install && npm run build
    staticPublishPath: ./client/dist
    envVars:
      - key: VITE_API_URL
        value: https://dermoscanner-api.onrender.com
```

**Environment Variables**:

Server (`.env`):
```
MONGO_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://dermoscanner.vercel.app
PORT=5000
NODE_ENV=production
```

Client (`.env`):
```
VITE_API_URL=https://dermoscanner-api.onrender.com
```

**CORS Configuration**:
```javascript
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE']
}));
```

## Data Models

### Scan Schema (MongoDB)

```javascript
// dermoscanners/server/models/Scan.js
import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  result: {
    type: String,
    enum: ['benign', 'suspicious', 'malignant'],
    required: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  processingTime: {
    type: Number,
    required: true
  },
  imageUrl: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Scan', scanSchema);
```

### LocalStorage Format

```typescript
interface Scan {
  id: string;
  userId: string;
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  processingTime: number;
  imageUrl?: string;
  notes?: string;
  timestamp: string; // ISO 8601 format
}

// Stored as: localStorage.setItem('dermoscanner_history', JSON.stringify(scans))
```

## Error Handling

### Client-Side Error Handling

**Upload Errors**:
```typescript
try {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/api/ai/analyze', formData);
  // Handle success
} catch (error) {
  if (error.response?.status === 400) {
    showError('Invalid file format. Please upload JPEG, PNG, or WebP.');
  } else if (error.code === 'ECONNABORTED') {
    showError('Request timeout. Please try again.');
  } else {
    showError('Network error. Please check your connection.');
  }
}
```

**Storage Errors**:
```typescript
try {
  localStorage.setItem('dermoscanner_history', JSON.stringify(scans));
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    showWarning('Storage full. Please download backup and clear old scans.');
  }
}
```

### Server-Side Error Handling

**File Validation**:
```javascript
const validateImage = (req, res, next) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided' });
  }
  
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(req.file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type. Only JPEG, PNG, and WebP are supported.' 
    });
  }
  
  if (req.file.size > 5 * 1024 * 1024) {
    return res.status(400).json({ error: 'File size exceeds 5MB limit' });
  }
  
  next();
};
```

**Database Errors**:
```javascript
try {
  const scan = await Scan.create(scanData);
  res.status(201).json(scan);
} catch (error) {
  if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }
  if (error.name === 'MongoNetworkError') {
    return res.status(503).json({ 
      error: 'Database temporarily unavailable. Please try again.' 
    });
  }
  res.status(500).json({ error: 'Internal server error' });
}
```

## Testing Strategy

### Unit Testing (Vitest)

**Backend Tests** (`server/tests/ai.test.js`):
```javascript
describe('AI Analyze Endpoint', () => {
  test('returns mock result for valid image', async () => {
    const response = await request(app)
      .post('/api/ai/analyze')
      .attach('image', 'test-fixtures/sample.jpg');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('result');
    expect(response.body).toHaveProperty('confidence');
    expect(response.body.processingTime).toBeGreaterThanOrEqual(3000);
  });
  
  test('rejects invalid file format', async () => {
    const response = await request(app)
      .post('/api/ai/analyze')
      .attach('image', 'test-fixtures/sample.txt');
    
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid file type');
  });
});
```

**Frontend Tests** (Manual - see QA Checklist):
- Component rendering tests
- User interaction flows
- Error state handling

### Integration Testing

**End-to-End Flow Test**:
1. Upload valid image → Verify 200 response
2. Check result card renders → Verify DOM elements
3. Verify recommendation panel → Check correct tips displayed
4. Check localStorage → Verify scan saved
5. Check MongoDB → Verify scan persisted
6. Download backup → Verify JSON valid
7. Clear localStorage → Upload backup → Verify restore works

### Cross-Browser Testing

**Test Matrix**:
| Browser | Version | Desktop | Mobile | Status |
|---------|---------|---------|--------|--------|
| Chrome  | Latest  | ✓       | ✓      | Pass   |
| Edge    | Latest  | ✓       | N/A    | Pass   |
| Safari  | Latest  | ✓       | ✓      | Pass   |
| Firefox | Latest  | ✓       | N/A    | Pass   |

**Test Checklist**:
- [ ] Image upload works
- [ ] Result card displays correctly
- [ ] Recommendation panel loads
- [ ] No console errors
- [ ] Responsive layout (320px-1920px)
- [ ] Touch interactions work (mobile)

### QA Report Template

**Location**: `dermoscanners/QA_REPORT_SPRINT3.md`

```markdown
# Sprint 3 QA Report

## Test Summary
- Total Tests: 25
- Passed: 24
- Failed: 1
- Coverage: 96%

## Test Results

### Feature 1: Mock AI API
- ✅ Valid upload returns result
- ✅ Invalid format rejected
- ✅ 3-second delay verified
- ❌ Large file (>5MB) not rejected (BUG-001)

### Known Issues
- **BUG-001**: File size validation not enforced
  - Severity: Medium
  - Impact: Server memory usage
  - Fix: Add multer size limit
  - ETA: Sprint 4

## Browser Compatibility
- Chrome 120: ✅ All tests pass
- Safari 17: ✅ All tests pass
- Edge 120: ✅ All tests pass
- Firefox 121: ✅ All tests pass

## Performance Metrics
- Average scan time: 3.2s
- Page load time: 1.8s
- Lighthouse score: 92/100
```

## Demo Preparation

### Persona: Sarah (User Journey)

**Background**: Sarah is a 32-year-old teacher who noticed a new mole on her arm and wants to check if it's concerning before scheduling a doctor's appointment.

**Demo Script** (7 minutes):

**Minute 0-1: Introduction**
- Speaker: Project Manager
- Content: "Meet Sarah. She's concerned about a new mole and wants quick guidance."
- Slide: Persona card with photo and background

**Minute 1-3: Upload & Scan**
- Speaker: Frontend Developer
- Action: Navigate to /scan page
- Action: Upload sample image (benign mole)
- Show: Loading spinner with "Analyzing..." message
- Show: 3-second processing simulation
- Outcome: Result card appears with "Benign - Low Risk" and 87% confidence

**Minute 3-5: Recommendations & History**
- Speaker: Backend Developer
- Show: Recommendation panel with 3 health tips
- Action: Navigate to scan history page
- Show: Previous scans listed with timestamps
- Action: Click "Download Backup" button
- Outcome: JSON file downloads successfully

**Minute 5-6: Cloud Sync Demo**
- Speaker: DevOps Engineer
- Show: Browser console with MongoDB connection logs
- Action: Refresh page
- Show: Scans persist (loaded from cloud)
- Outcome: Data integrity verified

**Minute 6-7: Cross-Device Demo**
- Speaker: QA Tester
- Action: Open app on mobile device (or responsive view)
- Show: Same scan history appears
- Show: Upload works on mobile
- Outcome: Seamless cross-device experience

**Backup Video**: Pre-record full demo in case of live issues

### Demo Assets

**Required Files**:
- `demo/slides.pdf` - Presentation slides
- `demo/script.md` - Detailed speaking notes
- `demo/sample-images/` - Test images (benign, suspicious, malignant)
- `demo/backup-video.mp4` - Pre-recorded demo
- `demo/persona-card.png` - Sarah's persona visual

**Technical Setup**:
- Deployed app URL ready
- Test account credentials
- Sample images pre-loaded
- Database seeded with demo data
- Backup internet connection (mobile hotspot)

## Implementation Notes

### Code Style Guidelines

**Naming Conventions**:
- Components: PascalCase (`ResultCard.tsx`)
- Functions: camelCase (`analyzeImage()`)
- Constants: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`)
- Files: kebab-case (`ai-routes.js`)

**Code Organization**:
```
server/
├── controllers/     # Business logic
├── routes/          # API endpoints
├── models/          # Database schemas
├── middleware/      # Validation, auth
├── utils/           # Helper functions
└── data/            # Static JSON files

client/
├── components/      # React components
├── pages/           # Route pages
├── utils/           # Helper functions
├── hooks/           # Custom React hooks
└── types/           # TypeScript interfaces
```

**Comment Standards**:
```javascript
// Good: Explain WHY, not WHAT
// Simulate 3-second delay to mimic real AI inference time
await new Promise(resolve => setTimeout(resolve, 3000));

// Bad: Obvious comment
// Wait 3 seconds
await new Promise(resolve => setTimeout(resolve, 3000));
```

### Performance Optimizations

1. **Lazy Load Components**: Use React.lazy() for recommendation panel
2. **Debounce API Calls**: Prevent duplicate uploads
3. **Cache Recommendations**: Store JSON in memory after first fetch
4. **Optimize Images**: Compress uploads to max 1MB before sending
5. **Index Database**: Add index on `userId` and `timestamp` fields

### Security Considerations

1. **File Upload**: Validate MIME type server-side (not just extension)
2. **Rate Limiting**: Max 10 scans per user per hour
3. **Authentication**: Require JWT token for all scan endpoints
4. **Data Privacy**: Never log image data or scan results
5. **HTTPS Only**: Enforce secure connections in production

## Success Metrics

### Demo Success Criteria

- [ ] Complete demo within 7 minutes
- [ ] All features work without errors
- [ ] Audience understands user value
- [ ] Questions answered confidently
- [ ] Backup video ready if needed

### Technical Success Criteria

- [ ] All 9 requirements implemented
- [ ] 95%+ test pass rate
- [ ] Zero critical bugs
- [ ] Deployed to production
- [ ] QA report completed

### User Value Delivered

1. **Instant Feedback**: Results in 3 seconds
2. **Actionable Guidance**: Clear health recommendations
3. **Data Security**: Backup and restore capability
4. **Accessibility**: Works on all devices
5. **Reliability**: Cloud sync prevents data loss
