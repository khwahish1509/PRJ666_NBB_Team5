# MongoDB Atlas Connection & Sync Implementation

## Overview
This document describes the MongoDB Atlas connection and synchronization features implemented for Sprint 3.

## Features Implemented

### 1. Enhanced MongoDB Connection (Task 5.1)
**Location**: `server/config/db.js`

**Features**:
- ✅ Connection retry logic with 3 attempts
- ✅ Exponential backoff (2^attempt seconds between retries)
- ✅ 10-second connection timeout
- ✅ Comprehensive connection status logging
- ✅ Event listeners for connection state changes (connected, disconnected, error, reconnected)

**Usage**:
```javascript
await connectDatabase(process.env.MONGO_URI);
// Logs: [MongoDB] Attempting to connect... (Attempt 1/3)
// Logs: [MongoDB] ✓ Connected successfully
// Logs: [MongoDB] Status: connected
```

### 2. Sync Error Handling (Task 5.2)

#### A. Sync Queue System
**Location**: `client/src/utils/syncQueue.ts`

**Features**:
- Queues failed MongoDB operations for retry
- Tracks retry count (max 3 attempts)
- Stores operations in localStorage
- Supports create, update, and delete operations

#### B. Sync Status Management
**Location**: `client/src/utils/syncStatus.ts`

**Features**:
- Tracks sync status: `connected`, `syncing`, `error`, `offline`
- Offline mode detection using `navigator.onLine`
- Event listeners for online/offline browser events
- Observable pattern for status change notifications

#### C. Sync Manager
**Location**: `client/src/utils/syncManager.ts`

**Features**:
- Wraps all MongoDB API calls with error handling
- Automatically queues failed operations
- Processes queue when connection is restored
- Periodic queue processing (every 30 seconds)
- Handles network errors and MongoDB unavailability (503 status)

**API Methods**:
```typescript
// Sync scan to MongoDB with automatic error handling
await syncScanToMongoDB(scanData);

// Update scan with automatic error handling
await syncUpdateToMongoDB(scanId, updates);

// Delete scan with automatic error handling
await syncDeleteToMongoDB(scanId);

// Process queued operations
await processQueue();
```

#### D. Updated Scan Storage
**Location**: `client/src/utils/scanStorage.ts`

**Changes**:
- All storage functions now sync to MongoDB automatically
- Functions are now async and return Promises
- Optional `syncToCloud` parameter to disable cloud sync
- Graceful error handling with automatic queueing

**Updated API**:
```typescript
// Save scan (localStorage + MongoDB)
await saveScan(scan);

// Update scan (localStorage + MongoDB)
await updateScan(scanId, updates);

// Delete scan (localStorage + MongoDB)
await deleteScan(scanId);
```

#### E. Sync Status Indicator UI
**Location**: `client/src/components/common/SyncStatusIndicator.tsx`

**Features**:
- Fixed position indicator (bottom-right corner)
- Color-coded status display:
  - 🔵 Blue: Syncing...
  - ⚠️ Yellow: Sync error / Pending operations
  - ⚪ Gray: Offline
  - 🟢 Green: Connected (hidden when no issues)
- Shows number of pending operations
- Auto-hides when connected with no queue

### 3. Server-Side Error Handling
**Location**: `server/controllers/scanController.js`

**Features**:
- ✅ Try-catch blocks around all MongoDB operations
- ✅ MongoNetworkError handling with 503 status
- ✅ User-friendly error messages
- ✅ Validation error handling
- ✅ Proper error logging

## Testing

### Test MongoDB Connection
```bash
cd dermoscanners/server
node test-db-connection.js
```

Expected output:
```
Testing MongoDB connection with retry logic...

[MongoDB] Attempting to connect... (Attempt 1/3)
[MongoDB] ✓ Connected successfully
[MongoDB] Status: connected

✓ Connection test successful!
```

### Test Offline Mode
1. Open the app in browser
2. Open DevTools Console
3. Go offline (DevTools Network tab → Offline)
4. Perform a scan operation
5. Check console logs:
   ```
   [SyncManager] Offline - queuing operation
   [SyncQueue] Operation queued: create_1234567890_abc123
   ```
6. Go back online
7. Check console logs:
   ```
   [SyncStatus] Network connection restored
   [SyncManager] Network restored - processing queue
   [SyncManager] Processing 1 queued operations
   [SyncManager] Scan synced successfully
   [SyncQueue] Operation removed: create_1234567890_abc123
   ```

## Environment Variables

Ensure these are set in `server/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
```

## Architecture Flow

```
User Action (Save/Update/Delete Scan)
    ↓
scanStorage.ts (Save to localStorage)
    ↓
syncManager.ts (Attempt MongoDB sync)
    ↓
    ├─ Success → Update sync status to "connected"
    │
    └─ Failure → Queue operation + Update status to "error"
           ↓
       syncQueue.ts (Store in localStorage)
           ↓
       Retry on:
       - Network restored (online event)
       - Periodic check (every 30s)
       - Manual retry
```

## Requirements Satisfied

✅ **Requirement 4.1**: MongoDB connection with URI from .env and connection status logging  
✅ **Requirement 4.3**: Sync error handling with user-friendly messages and operation queueing  
✅ **Requirement 4.4**: Connection timeout (10 seconds) and retry logic (3 attempts)

## Next Steps

To use the sync features in your components:

```typescript
import { saveScan } from '../utils/scanStorage';
import { getSyncStatus } from '../utils/syncStatus';

// Save a scan (automatically syncs to MongoDB)
const success = await saveScan({
  id: 'scan_123',
  userId: 'user_456',
  result: 'benign',
  confidence: 0.87,
  processingTime: 3200,
  timestamp: new Date().toISOString()
});

// Check sync status
const status = getSyncStatus(); // 'connected' | 'syncing' | 'error' | 'offline'
```

The SyncStatusIndicator component is automatically displayed in the app and will show the current sync status to users.
