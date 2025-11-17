import { useState, useRef } from 'react';
import { Download, Upload } from 'lucide-react';
import { downloadBackup, restoreBackup } from '../../utils/backupManager';
import { getScans } from '../../utils/scanStorage';

interface BackupControlsProps {
  onRestoreComplete?: (scanCount: number) => void;
}

export default function BackupControls({ onRestoreComplete }: BackupControlsProps) {
  const [isRestoring, setIsRestoring] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadBackup = () => {
    try {
      const scans = getScans();
      
      if (scans.length === 0) {
        setMessage({ type: 'error', text: 'No scans to backup' });
        setTimeout(() => setMessage(null), 3000);
        return;
      }
      
      downloadBackup(scans);
      setMessage({ type: 'success', text: `Backup downloaded: ${scans.length} scans` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Download backup error:', error);
      setMessage({ type: 'error', text: 'Failed to download backup' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsRestoring(true);
    setMessage(null);

    try {
      const restoredScans = await restoreBackup(file);
      setMessage({ 
        type: 'success', 
        text: `Backup restored successfully: ${restoredScans.length} scans` 
      });
      
      // Notify parent component
      if (onRestoreComplete) {
        onRestoreComplete(restoredScans.length);
      }
      
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Restore backup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore backup';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setIsRestoring(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Backup/Restore Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleDownloadBackup}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-sm"
        >
          <Download size={18} />
          <span>Download Backup</span>
        </button>

        <button
          onClick={handleUploadClick}
          disabled={isRestoring}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload size={18} />
          <span>{isRestoring ? 'Restoring...' : 'Upload Backup'}</span>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Status Message */}
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Info Text */}
      <p className="text-xs text-gray-500">
        Download your scan history as a backup file or restore from a previous backup.
      </p>
    </div>
  );
}
