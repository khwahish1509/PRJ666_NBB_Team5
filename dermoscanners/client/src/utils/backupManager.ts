import { Scan, getScans, saveScan } from './scanStorage';

/**
 * Download all scans as a JSON backup file
 * @param scans - Array of scans to backup (defaults to all scans from localStorage)
 */
export function downloadBackup(scans?: Scan[]): void {
  try {
    // Get scans from localStorage if not provided
    const scansToBackup = scans || getScans();
    
    // Create JSON blob with pretty formatting
    const blob = new Blob([JSON.stringify(scansToBackup, null, 2)], {
      type: 'application/json'
    });
    
    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Format filename with timestamp
    const timestamp = Date.now();
    link.download = `dermoscanner-backup-${timestamp}.json`;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Backup downloaded: ${scansToBackup.length} scans`);
  } catch (error) {
    console.error('Error downloading backup:', error);
    throw new Error('Failed to download backup file');
  }
}

/**
 * Restore scans from an uploaded JSON backup file
 * @param file - The backup JSON file to restore
 * @returns Promise that resolves with the restored scans
 */
export function restoreBackup(file: File): Promise<Scan[]> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.name.endsWith('.json')) {
      reject(new Error('Invalid file type. Please upload a JSON backup file.'));
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        
        // Parse JSON
        const restoredScans = JSON.parse(content);
        
        // Validate structure
        if (!Array.isArray(restoredScans)) {
          reject(new Error('Invalid backup file format. Expected an array of scans.'));
          return;
        }
        
        // Validate each scan has required fields
        const isValid = restoredScans.every((scan: any) => {
          return (
            scan.id &&
            scan.userId &&
            scan.result &&
            typeof scan.confidence === 'number' &&
            typeof scan.processingTime === 'number' &&
            scan.timestamp
          );
        });
        
        if (!isValid) {
          reject(new Error('Invalid backup file. Some scans are missing required fields.'));
          return;
        }
        
        // Get existing scans
        const existingScans = getScans();
        const existingIds = new Set(existingScans.map(s => s.id));
        
        // Merge: only add scans that don't already exist
        let addedCount = 0;
        restoredScans.forEach((scan: Scan) => {
          if (!existingIds.has(scan.id)) {
            saveScan(scan);
            addedCount++;
          }
        });
        
        console.log(`Backup restored: ${addedCount} new scans added, ${restoredScans.length - addedCount} duplicates skipped`);
        
        resolve(restoredScans);
      } catch (error) {
        if (error instanceof SyntaxError) {
          reject(new Error('Invalid JSON file. Please upload a valid backup file.'));
        } else {
          reject(error);
        }
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Failed to read backup file.'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Validate a backup file without restoring it
 * @param file - The backup JSON file to validate
 * @returns Promise that resolves with validation result
 */
export function validateBackupFile(file: File): Promise<{ valid: boolean; scanCount: number; error?: string }> {
  return new Promise((resolve) => {
    if (!file.name.endsWith('.json')) {
      resolve({ valid: false, scanCount: 0, error: 'Invalid file type' });
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const scans = JSON.parse(content);
        
        if (!Array.isArray(scans)) {
          resolve({ valid: false, scanCount: 0, error: 'Invalid format' });
          return;
        }
        
        resolve({ valid: true, scanCount: scans.length });
      } catch {
        resolve({ valid: false, scanCount: 0, error: 'Invalid JSON' });
      }
    };
    
    reader.onerror = () => {
      resolve({ valid: false, scanCount: 0, error: 'Failed to read file' });
    };
    
    reader.readAsText(file);
  });
}
