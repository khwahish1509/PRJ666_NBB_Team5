# Backup and Restore Usage Guide

This guide explains how to use the backup and restore functionality for AI scan history.

## Components Created

### 1. `backupManager.ts` - Core Utility Functions

Located at: `dermoscanners/client/src/utils/backupManager.ts`

**Functions:**

- `downloadBackup(scans?: Scan[])` - Downloads all scans as a JSON file
- `restoreBackup(file: File)` - Restores scans from an uploaded JSON backup file
- `validateBackupFile(file: File)` - Validates a backup file without restoring it

### 2. `BackupControls.tsx` - UI Component

Located at: `dermoscanners/client/src/components/scan/BackupControls.tsx`

A ready-to-use React component with download and upload buttons.

## Usage Examples

### Using the BackupControls Component

```tsx
import BackupControls from '../components/scan/BackupControls';

function ScanHistoryPage() {
  const handleRestoreComplete = (scanCount: number) => {
    console.log(`Restored ${scanCount} scans`);
    // Refresh your scan list here
  };

  return (
    <div>
      <h1>Scan History</h1>
      <BackupControls onRestoreComplete={handleRestoreComplete} />
      {/* Your scan list here */}
    </div>
  );
}
```

### Using the Utility Functions Directly

```tsx
import { downloadBackup, restoreBackup } from '../utils/backupManager';
import { getScans } from '../utils/scanStorage';

// Download backup
function handleDownload() {
  const scans = getScans();
  downloadBackup(scans);
}

// Restore backup
async function handleRestore(file: File) {
  try {
    const restoredScans = await restoreBackup(file);
    console.log(`Restored ${restoredScans.length} scans`);
  } catch (error) {
    console.error('Restore failed:', error.message);
  }
}
```

## Backup File Format

The backup file is a JSON array of scan objects:

```json
[
  {
    "id": "scan-123",
    "userId": "user-456",
    "result": "benign",
    "confidence": 0.87,
    "processingTime": 3200,
    "imageUrl": "https://...",
    "notes": "Optional notes",
    "timestamp": "2024-11-15T10:30:00.000Z"
  }
]
```

## Features

### Download Backup
- Generates a JSON file with all scans from localStorage
- Filename format: `dermoscanner-backup-{timestamp}.json`
- Automatically triggers browser download
- Cleans up temporary URLs after download

### Restore Backup
- Validates file type (must be .json)
- Validates JSON structure
- Validates required fields in each scan
- Merges with existing scans (skips duplicates based on ID)
- Shows success/error messages
- Handles errors gracefully

### Error Handling
- Invalid file type
- Corrupted JSON
- Missing required fields
- File read errors
- Storage quota exceeded

## Integration with Task 9

When implementing task 9 (Create scan history page), use the `BackupControls` component:

```tsx
// ScanHistoryPage.tsx
import { useState, useEffect } from 'react';
import { getScans, deleteScan } from '../utils/scanStorage';
import BackupControls from '../components/scan/BackupControls';

export default function ScanHistoryPage() {
  const [scans, setScans] = useState([]);

  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = () => {
    setScans(getScans());
  };

  const handleRestoreComplete = () => {
    // Reload scans after restore
    loadScans();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Scan History</h1>
      
      {/* Backup/Restore Controls */}
      <div className="mb-6">
        <BackupControls onRestoreComplete={handleRestoreComplete} />
      </div>

      {/* Scan List */}
      {scans.length === 0 ? (
        <p>No scans yet. Start by scanning a skin lesion!</p>
      ) : (
        <div className="space-y-4">
          {scans.map(scan => (
            <div key={scan.id} className="border p-4 rounded">
              {/* Display scan details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## Testing

To test the backup/restore functionality:

1. Add some test scans to localStorage:
```tsx
import { saveScan } from './utils/scanStorage';

saveScan({
  id: 'test-1',
  userId: 'user-123',
  result: 'benign',
  confidence: 0.87,
  processingTime: 3200,
  timestamp: new Date().toISOString()
});
```

2. Click "Download Backup" - should download a JSON file
3. Clear localStorage: `localStorage.clear()`
4. Click "Upload Backup" and select the downloaded file
5. Verify scans are restored

## Requirements Satisfied

- ✅ 3.3: Download backup as JSON file with timestamp filename
- ✅ 3.5: Restore scans from uploaded backup file
- ✅ Validate JSON structure before restoring
- ✅ Merge with existing data (skip duplicates)
- ✅ Show success/error notifications
