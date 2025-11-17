/**
 * ScanHistoryPage Component
 * Displays all AI scan results with backup/restore functionality
 */

import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Download, Upload, Trash2, Clock, AlertCircle, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { Scan, getScans, deleteScan } from '../utils/scanStorage';
import { downloadBackup, restoreBackup } from '../utils/backupManager';

export default function ScanHistoryPage() {
  const navigate = useNavigate();
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load scans from localStorage on mount
  useEffect(() => {
    loadScans();
  }, []);

  const loadScans = () => {
    try {
      setLoading(true);
      const storedScans = getScans();
      setScans(storedScans);
    } catch (error) {
      console.error('Error loading scans:', error);
      showNotification('error', 'Failed to load scan history');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    try {
      downloadBackup(scans);
      showNotification('success', `Backup downloaded: ${scans.length} scans`);
    } catch (error) {
      console.error('Error downloading backup:', error);
      showNotification('error', 'Failed to download backup');
    }
  };

  const handleUploadBackup = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const restoredScans = await restoreBackup(file);
      loadScans(); // Reload scans from localStorage
      showNotification('success', `Backup restored: ${restoredScans.length} scans processed`);
    } catch (error) {
      console.error('Error restoring backup:', error);
      showNotification('error', error instanceof Error ? error.message : 'Failed to restore backup');
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteScan = async (scanId: string) => {
    try {
      const success = await deleteScan(scanId);
      if (success) {
        setScans(scans.filter(scan => scan.id !== scanId));
        showNotification('success', 'Scan deleted successfully');
      } else {
        showNotification('error', 'Failed to delete scan');
      }
    } catch (error) {
      console.error('Error deleting scan:', error);
      showNotification('error', 'Failed to delete scan');
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const getResultConfig = (result: 'benign' | 'suspicious' | 'malignant') => {
    const configs = {
      benign: {
        label: 'Benign',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        icon: CheckCircle,
      },
      suspicious: {
        label: 'Suspicious',
        color: 'text-yellow-700',
        bgColor: 'bg-yellow-100',
        icon: AlertTriangle,
      },
      malignant: {
        label: 'Malignant',
        color: 'text-red-700',
        bgColor: 'bg-red-100',
        icon: XCircle,
      },
    };
    return configs[result];
  };

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Enhanced Header */}
      <div className="mb-8 text-center header-fade-in">
        <div className="inline-block mb-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-2xl shadow-lg">
            <Clock className="text-white" size={32} />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Scan History
        </h1>
        <p className="text-gray-600 text-lg">View and manage your AI scan results</p>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`
            fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg
            ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}
            animate-slide-in
          `}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? (
              <CheckCircle className="text-green-600" size={20} />
            ) : (
              <AlertCircle className="text-red-600" size={20} />
            )}
            <p className={notification.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {notification.message}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button
          onClick={handleDownloadBackup}
          disabled={scans.length === 0}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl font-semibold"
        >
          <Download size={22} />
          <span>Download Backup</span>
        </button>
        <button
          onClick={handleUploadBackup}
          className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold"
        >
          <Upload size={22} />
          <span>Upload Backup</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Enhanced Scan List */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border border-gray-100">
        {loading ? (
          <div className="text-center py-16">
            <div className="relative inline-block">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="text-indigo-600" size={24} />
              </div>
            </div>
            <p className="mt-6 text-gray-600 font-medium">Loading scan history...</p>
          </div>
        ) : scans.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl inline-block mb-6">
              <Clock size={64} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Scans Yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start by scanning a skin lesion to see your results here. Your scan history will be automatically saved and synced.
            </p>
            <button
              onClick={() => navigate('/scan')}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold text-lg"
            >
              Start Your First Scan
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-gray-200">
              <div>
                <p className="text-lg font-bold text-gray-800">
                  Total Scans: <span className="text-indigo-600">{scans.length}</span>
                </p>
                <p className="text-sm text-gray-500">All your scan results in one place</p>
              </div>
            </div>
            <div className="space-y-4">
              {scans.map((scan, index) => {
                const config = getResultConfig(scan.result);
                const Icon = config.icon;
                const confidencePercentage = Math.round(scan.confidence * 100);

                return (
                  <div
                    key={scan.id}
                    className="scan-card-entrance bg-white border-2 border-gray-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 relative overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Gradient accent */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${
                      scan.result === 'benign' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                      scan.result === 'suspicious' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                      'bg-gradient-to-r from-red-400 to-rose-500'
                    }`}></div>

                    <div className="flex items-start justify-between gap-4">
                      {/* Result Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-4">
                          <div className={`${config.bgColor} p-3 rounded-xl shadow-md`}>
                            <Icon className={config.color} size={24} strokeWidth={2.5} />
                          </div>
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${config.color} mb-1`}>
                              {config.label}
                            </h3>
                            <p className="text-sm text-gray-600 font-medium">
                              Confidence: {confidencePercentage}%
                            </p>
                          </div>
                        </div>

                        {/* Enhanced Confidence Bar */}
                        <div className="mb-4">
                          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${
                                scan.result === 'benign'
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                  : scan.result === 'suspicious'
                                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                  : 'bg-gradient-to-r from-red-400 to-rose-500'
                              }`}
                              style={{ width: `${confidencePercentage}%` }}
                            />
                          </div>
                        </div>

                        {/* Enhanced Metadata */}
                        <div className="flex flex-wrap gap-3">
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <Clock size={16} className="text-gray-500" />
                            <span className="text-sm text-gray-700 font-medium">
                              {formatTimestamp(scan.timestamp)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="text-sm text-gray-700 font-medium">
                              {(scan.processingTime / 1000).toFixed(2)}s
                            </span>
                          </div>
                        </div>

                        {/* Notes */}
                        {scan.notes && (
                          <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
                            <p className="text-sm text-gray-700">
                              <span className="font-semibold text-indigo-700">Notes:</span> {scan.notes}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Delete Button */}
                      <div>
                        {deleteConfirmId === scan.id ? (
                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => handleDeleteScan(scan.id)}
                              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white text-sm font-semibold rounded-lg hover:from-red-700 hover:to-rose-700 transition shadow-md"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-300 transition"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmId(scan.id)}
                            className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Delete scan"
                          >
                            <Trash2 size={22} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes headerFadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scanCardEntrance {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slideIn 300ms ease-out;
        }

        .header-fade-in {
          animation: headerFadeIn 600ms ease-out;
        }

        .scan-card-entrance {
          animation: scanCardEntrance 400ms ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
