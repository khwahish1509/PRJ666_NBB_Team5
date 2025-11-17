// Sync status management
export type SyncStatus = 'connected' | 'syncing' | 'error' | 'offline';

let currentStatus: SyncStatus = 'offline';
let statusListeners: Array<(status: SyncStatus) => void> = [];

/**
 * Set the current sync status
 */
export function setSyncStatus(status: SyncStatus): void {
  if (currentStatus !== status) {
    currentStatus = status;
    console.log(`[SyncStatus] Status changed to: ${status}`);
    
    // Notify all listeners
    statusListeners.forEach(listener => {
      try {
        listener(status);
      } catch (error) {
        console.error('[SyncStatus] Error in status listener:', error);
      }
    });
  }
}

/**
 * Get the current sync status
 */
export function getSyncStatus(): SyncStatus {
  return currentStatus;
}

/**
 * Subscribe to sync status changes
 */
export function onSyncStatusChange(listener: (status: SyncStatus) => void): () => void {
  statusListeners.push(listener);
  
  // Return unsubscribe function
  return () => {
    statusListeners = statusListeners.filter(l => l !== listener);
  };
}

/**
 * Check if the app is online
 */
export function isOnline(): boolean {
  return typeof navigator !== 'undefined' && navigator.onLine;
}

/**
 * Initialize offline mode detection
 */
export function initOfflineDetection(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Set initial status based on navigator.onLine
  setSyncStatus(isOnline() ? 'connected' : 'offline');

  // Listen for online/offline events
  window.addEventListener('online', () => {
    console.log('[SyncStatus] Network connection restored');
    setSyncStatus('connected');
  });

  window.addEventListener('offline', () => {
    console.log('[SyncStatus] Network connection lost');
    setSyncStatus('offline');
  });
}
