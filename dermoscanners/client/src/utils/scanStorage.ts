import { syncScanToMongoDB, syncUpdateToMongoDB, syncDeleteToMongoDB } from './syncManager';

// Scan data interface
export interface Scan {
  id: string;
  userId: string;
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  processingTime: number;
  imageUrl?: string;
  notes?: string;
  timestamp: string; // ISO 8601 format
}

const STORAGE_KEY = 'dermoscanner_history';

/**
 * Save a scan to localStorage and sync to MongoDB
 * @param scan - The scan object to save
 * @param syncToCloud - Whether to sync to MongoDB (default: true)
 * @returns true if successful, false if storage quota exceeded
 */
export async function saveScan(scan: Scan, syncToCloud: boolean = true): Promise<boolean> {
  try {
    const scans = getScans();
    
    // Ensure timestamp is in ISO 8601 format
    const scanToSave = {
      ...scan,
      timestamp: scan.timestamp || new Date().toISOString()
    };
    
    // Add new scan to the beginning of the array
    scans.unshift(scanToSave);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    
    // Sync to MongoDB if requested
    if (syncToCloud) {
      try {
        await syncScanToMongoDB(scanToSave);
      } catch (error) {
        // Sync error is already handled by syncManager (queued for retry)
        console.log('[scanStorage] Scan saved locally, sync will retry');
      }
    }
    
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('Storage quota exceeded. Please download backup and clear old scans.');
      // Show user warning
      if (typeof window !== 'undefined') {
        alert('Storage full. Please download backup and clear old scans.');
      }
      return false;
    }
    console.error('Error saving scan to localStorage:', error);
    return false;
  }
}

/**
 * Get all scans from localStorage
 * @returns Array of scan objects, sorted by timestamp (newest first)
 */
export function getScans(): Scan[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    
    const scans = JSON.parse(stored) as Scan[];
    
    // Sort by timestamp descending (newest first)
    return scans.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  } catch (error) {
    console.error('Error reading scans from localStorage:', error);
    return [];
  }
}

/**
 * Clear all scans from localStorage
 * @returns true if successful
 */
export function clearScans(): boolean {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing scans from localStorage:', error);
    return false;
  }
}

/**
 * Update a specific scan in localStorage and sync to MongoDB
 * @param scanId - The ID of the scan to update
 * @param updates - Partial scan object with fields to update
 * @param syncToCloud - Whether to sync to MongoDB (default: true)
 * @returns true if successful, false if scan not found
 */
export async function updateScan(scanId: string, updates: Partial<Scan>, syncToCloud: boolean = true): Promise<boolean> {
  try {
    const scans = getScans();
    const index = scans.findIndex(scan => scan.id === scanId);
    
    if (index === -1) {
      console.error('Scan not found:', scanId);
      return false;
    }
    
    // Update the scan
    scans[index] = { ...scans[index], ...updates };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scans));
    
    // Sync to MongoDB if requested
    if (syncToCloud) {
      try {
        await syncUpdateToMongoDB(scanId, updates);
      } catch (error) {
        console.log('[scanStorage] Update saved locally, sync will retry');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error updating scan in localStorage:', error);
    return false;
  }
}

/**
 * Delete a specific scan from localStorage and sync to MongoDB
 * @param scanId - The ID of the scan to delete
 * @param syncToCloud - Whether to sync to MongoDB (default: true)
 * @returns true if successful, false if scan not found
 */
export async function deleteScan(scanId: string, syncToCloud: boolean = true): Promise<boolean> {
  try {
    const scans = getScans();
    const filtered = scans.filter(scan => scan.id !== scanId);
    
    if (filtered.length === scans.length) {
      console.error('Scan not found:', scanId);
      return false;
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    
    // Sync to MongoDB if requested
    if (syncToCloud) {
      try {
        await syncDeleteToMongoDB(scanId);
      } catch (error) {
        console.log('[scanStorage] Delete saved locally, sync will retry');
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting scan from localStorage:', error);
    return false;
  }
}

/**
 * Get the total number of scans in localStorage
 * @returns Number of scans
 */
export function getScanCount(): number {
  return getScans().length;
}

/**
 * Check if localStorage is available and has space
 * @returns true if storage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
