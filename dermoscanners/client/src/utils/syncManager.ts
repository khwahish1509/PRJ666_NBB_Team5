import { queueOperation, getQueue, removeFromQueue, incrementRetryCount } from './syncQueue';
import { setSyncStatus, getSyncStatus, isOnline } from './syncStatus';
import api from '../services/api';

/**
 * Sync a scan to MongoDB with error handling
 */
export async function syncScanToMongoDB(scanData: any): Promise<boolean> {
  // Check if online
  if (!isOnline()) {
    console.log('[SyncManager] Offline - queuing operation');
    queueOperation('create', scanData);
    setSyncStatus('offline');
    return false;
  }

  try {
    setSyncStatus('syncing');
    
    const response = await api.post('/api/scans', scanData);
    
    if (response.data.success) {
      console.log('[SyncManager] Scan synced successfully');
      setSyncStatus('connected');
      return true;
    } else {
      throw new Error('Sync failed: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('[SyncManager] Sync error:', error.message);
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message.includes('Network Error')) {
      console.log('[SyncManager] Network error - queuing operation');
      queueOperation('create', scanData);
      setSyncStatus('error');
      return false;
    }
    
    // Handle MongoDB network errors (503 status)
    if (error.response?.status === 503) {
      console.log('[SyncManager] Database unavailable - queuing operation');
      queueOperation('create', scanData);
      setSyncStatus('error');
      return false;
    }
    
    // Other errors (validation, etc.) - don't queue
    setSyncStatus('error');
    throw error;
  }
}

/**
 * Update scan notes in MongoDB with error handling
 */
export async function syncUpdateToMongoDB(scanId: string, updates: any): Promise<boolean> {
  if (!isOnline()) {
    console.log('[SyncManager] Offline - queuing update');
    queueOperation('update', { scanId, updates });
    setSyncStatus('offline');
    return false;
  }

  try {
    setSyncStatus('syncing');
    
    const response = await api.patch(`/api/scans/${scanId}`, updates);
    
    if (response.data.success) {
      console.log('[SyncManager] Update synced successfully');
      setSyncStatus('connected');
      return true;
    } else {
      throw new Error('Update failed: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('[SyncManager] Update error:', error.message);
    
    if (error.code === 'ERR_NETWORK' || error.response?.status === 503) {
      queueOperation('update', { scanId, updates });
      setSyncStatus('error');
      return false;
    }
    
    setSyncStatus('error');
    throw error;
  }
}

/**
 * Delete scan from MongoDB with error handling
 */
export async function syncDeleteToMongoDB(scanId: string): Promise<boolean> {
  if (!isOnline()) {
    console.log('[SyncManager] Offline - queuing delete');
    queueOperation('delete', { scanId });
    setSyncStatus('offline');
    return false;
  }

  try {
    setSyncStatus('syncing');
    
    const response = await api.delete(`/api/scans/${scanId}`);
    
    if (response.data.success) {
      console.log('[SyncManager] Delete synced successfully');
      setSyncStatus('connected');
      return true;
    } else {
      throw new Error('Delete failed: ' + response.data.message);
    }
  } catch (error: any) {
    console.error('[SyncManager] Delete error:', error.message);
    
    if (error.code === 'ERR_NETWORK' || error.response?.status === 503) {
      queueOperation('delete', { scanId });
      setSyncStatus('error');
      return false;
    }
    
    setSyncStatus('error');
    throw error;
  }
}

/**
 * Process queued operations (retry failed syncs)
 */
export async function processQueue(): Promise<void> {
  const queue = getQueue();
  
  if (queue.length === 0) {
    return;
  }

  if (!isOnline()) {
    console.log('[SyncManager] Offline - skipping queue processing');
    return;
  }

  console.log(`[SyncManager] Processing ${queue.length} queued operations`);

  for (const operation of queue) {
    try {
      let success = false;

      switch (operation.type) {
        case 'create':
          success = await syncScanToMongoDB(operation.data);
          break;
        case 'update':
          success = await syncUpdateToMongoDB(operation.data.scanId, operation.data.updates);
          break;
        case 'delete':
          success = await syncDeleteToMongoDB(operation.data.scanId);
          break;
      }

      if (success) {
        removeFromQueue(operation.id);
      } else {
        // Increment retry count
        const shouldRetry = incrementRetryCount(operation.id);
        if (!shouldRetry) {
          console.warn('[SyncManager] Operation exceeded max retries:', operation.id);
        }
      }
    } catch (error) {
      console.error('[SyncManager] Error processing queued operation:', error);
      incrementRetryCount(operation.id);
    }
  }
}

/**
 * Initialize sync manager (start queue processing)
 */
export function initSyncManager(): void {
  // Process queue on initialization
  processQueue();

  // Process queue when coming back online
  if (typeof window !== 'undefined') {
    window.addEventListener('online', () => {
      console.log('[SyncManager] Network restored - processing queue');
      setTimeout(processQueue, 1000); // Wait 1 second before processing
    });
  }

  // Periodic queue processing (every 30 seconds)
  setInterval(() => {
    if (isOnline() && getSyncStatus() !== 'syncing') {
      processQueue();
    }
  }, 30000);
}
