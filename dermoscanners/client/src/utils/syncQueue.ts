// Sync queue for failed MongoDB operations
export interface QueuedOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  data: any;
  timestamp: string;
  retryCount: number;
}

const QUEUE_KEY = 'dermoscanner_sync_queue';
const MAX_RETRIES = 3;

/**
 * Add a failed operation to the sync queue
 */
export function queueOperation(type: QueuedOperation['type'], data: any): void {
  try {
    const queue = getQueue();
    const operation: QueuedOperation = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data,
      timestamp: new Date().toISOString(),
      retryCount: 0
    };
    
    queue.push(operation);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log('[SyncQueue] Operation queued:', operation.id);
  } catch (error) {
    console.error('[SyncQueue] Error queuing operation:', error);
  }
}

/**
 * Get all queued operations
 */
export function getQueue(): QueuedOperation[] {
  try {
    const stored = localStorage.getItem(QUEUE_KEY);
    if (!stored) {
      return [];
    }
    return JSON.parse(stored) as QueuedOperation[];
  } catch (error) {
    console.error('[SyncQueue] Error reading queue:', error);
    return [];
  }
}

/**
 * Remove an operation from the queue
 */
export function removeFromQueue(operationId: string): void {
  try {
    const queue = getQueue();
    const filtered = queue.filter(op => op.id !== operationId);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(filtered));
    console.log('[SyncQueue] Operation removed:', operationId);
  } catch (error) {
    console.error('[SyncQueue] Error removing from queue:', error);
  }
}

/**
 * Increment retry count for an operation
 */
export function incrementRetryCount(operationId: string): boolean {
  try {
    const queue = getQueue();
    const operation = queue.find(op => op.id === operationId);
    
    if (!operation) {
      return false;
    }
    
    operation.retryCount++;
    
    // Remove if max retries exceeded
    if (operation.retryCount >= MAX_RETRIES) {
      console.warn('[SyncQueue] Max retries exceeded for operation:', operationId);
      removeFromQueue(operationId);
      return false;
    }
    
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    return true;
  } catch (error) {
    console.error('[SyncQueue] Error incrementing retry count:', error);
    return false;
  }
}

/**
 * Clear all queued operations
 */
export function clearQueue(): void {
  try {
    localStorage.removeItem(QUEUE_KEY);
    console.log('[SyncQueue] Queue cleared');
  } catch (error) {
    console.error('[SyncQueue] Error clearing queue:', error);
  }
}

/**
 * Get the number of queued operations
 */
export function getQueueSize(): number {
  return getQueue().length;
}
