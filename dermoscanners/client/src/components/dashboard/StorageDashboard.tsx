/**
 * StorageDashboard Component
 * Visual storage usage and backup status
 * Issue #3: Scan History Storage - Visual Impact Enhancement
 */

import { useState, useEffect } from 'react';
import { HardDrive, Download, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { getScans, getScanCount } from '../../utils/scanStorage';
import { downloadBackup } from '../../utils/backupManager';

interface StorageStats {
  totalScans: number;
  storageUsed: number; // in bytes
  storageLimit: number; // in bytes
  oldestScan: Date | null;
  newestScan: Date | null;
  lastBackup: Date | null;
  benignCount: number;
  suspiciousCount: number;
  malignantCount: number;
}

export default function StorageDashboard() {
  const [stats, setStats] = useState<StorageStats>({
    totalScans: 0,
    storageUsed: 0,
    storageLimit: 5 * 1024 * 1024, // 5MB default localStorage limit
    oldestScan: null,
    newestScan: null,
    lastBackup: null,
    benignCount: 0,
    suspiciousCount: 0,
    malignantCount: 0,
  });

  useEffect(() => {
    calculateStats();
  }, []);

  const calculateStats = () => {
    const scans = getScans();
    const totalScans = scans.length;

    if (totalScans === 0) {
      setStats(prev => ({ ...prev, totalScans: 0 }));
      return;
    }

    // Calculate storage used (approximate)
    const storageString = localStorage.getItem('dermoscanner_history') || '[]';
    const storageUsed = new Blob([storageString]).size;

    // Get oldest and newest scans
    const sortedScans = [...scans].sort((a, b) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
    const oldestScan = new Date(sortedScans[0].timestamp);
    const newestScan = new Date(sortedScans[sortedScans.length - 1].timestamp);

    // Count by result type
    const benignCount = scans.filter(s => s.result === 'benign').length;
    const suspiciousCount = scans.filter(s => s.result === 'suspicious').length;
    const malignantCount = scans.filter(s => s.result === 'malignant').length;

    // Get last backup time from localStorage
    const lastBackupStr = localStorage.getItem('last_backup_time');
    const lastBackup = lastBackupStr ? new Date(lastBackupStr) : null;

    setStats({
      totalScans,
      storageUsed,
      storageLimit: 5 * 1024 * 1024,
      oldestScan,
      newestScan,
      lastBackup,
      benignCount,
      suspiciousCount,
      malignantCount,
    });
  };

  const handleBackup = () => {
    const scans = getScans();
    downloadBackup(scans);
    localStorage.setItem('last_backup_time', new Date().toISOString());
    calculateStats();
  };

  const storagePercentage = (stats.storageUsed / stats.storageLimit) * 100;
  const isStorageWarning = storagePercentage > 75;
  const isStorageCritical = storagePercentage > 90;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getTimeSinceBackup = () => {
    if (!stats.lastBackup) return 'Never';
    
    const days = Math.floor((Date.now() - stats.lastBackup.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return `${Math.floor(days / 30)} months ago`;
  };

  const needsBackup = !stats.lastBackup || 
    (Date.now() - stats.lastBackup.getTime()) > 7 * 24 * 60 * 60 * 1000; // 7 days

  return (
    <div className="storage-dashboard">
      {/* Main Storage Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl border-2 border-gray-200 p-8 mb-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 p-3 rounded-xl shadow-md">
              <HardDrive className="text-indigo-600" size={28} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Storage Overview</h2>
              <p className="text-sm text-gray-600">Your scan data at a glance</p>
            </div>
          </div>
        </div>

        {/* Storage Usage Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Storage Used</span>
            <span className="text-lg font-bold text-gray-800">
              {formatBytes(stats.storageUsed)} / {formatBytes(stats.storageLimit)}
            </span>
          </div>
          
          <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className={`
                absolute inset-y-0 left-0 rounded-full transition-all duration-500
                ${isStorageCritical ? 'bg-gradient-to-r from-red-500 to-rose-600' :
                  isStorageWarning ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                  'bg-gradient-to-r from-green-500 to-emerald-600'}
              `}
              style={{ width: `${Math.min(storagePercentage, 100)}%` }}
            >
              <div className="absolute inset-0 shimmer"></div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-gray-700 drop-shadow">
                {Math.round(storagePercentage)}%
              </span>
            </div>
          </div>

          {isStorageWarning && (
            <div className="mt-3 flex items-start gap-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <AlertTriangle className="text-yellow-600 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-yellow-800">
                <strong>Storage Warning:</strong> You're running low on space. Consider downloading a backup and clearing old scans.
              </p>
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Scans */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <TrendingUp className="text-indigo-600" size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-600">Total Scans</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.totalScans}</p>
          </div>

          {/* Oldest Scan */}
          <div className="bg-white rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Calendar className="text-purple-600" size={20} />
              </div>
              <span className="text-sm font-semibold text-gray-600">Oldest Scan</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{formatDate(stats.oldestScan)}</p>
          </div>

          {/* Last Backup */}
          <div className={`bg-white rounded-xl p-4 border-2 ${needsBackup ? 'border-orange-300 bg-orange-50' : 'border-gray-200'} hover:shadow-lg transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`${needsBackup ? 'bg-orange-100' : 'bg-green-100'} p-2 rounded-lg`}>
                {needsBackup ? (
                  <AlertTriangle className="text-orange-600" size={20} />
                ) : (
                  <CheckCircle className="text-green-600" size={20} />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-600">Last Backup</span>
            </div>
            <p className={`text-lg font-bold ${needsBackup ? 'text-orange-700' : 'text-gray-800'}`}>
              {getTimeSinceBackup()}
            </p>
          </div>
        </div>

        {/* Result Distribution */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Scan Results Distribution</h3>
          <div className="space-y-3">
            {/* Benign */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-green-700">Benign (Low Risk)</span>
                <span className="text-sm font-bold text-gray-800">{stats.benignCount}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalScans > 0 ? (stats.benignCount / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Suspicious */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-yellow-700">Suspicious (Moderate Risk)</span>
                <span className="text-sm font-bold text-gray-800">{stats.suspiciousCount}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalScans > 0 ? (stats.suspiciousCount / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>

            {/* Malignant */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-semibold text-red-700">Malignant (High Risk)</span>
                <span className="text-sm font-bold text-gray-800">{stats.malignantCount}</span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-400 to-rose-500 rounded-full transition-all duration-500"
                  style={{ width: `${stats.totalScans > 0 ? (stats.malignantCount / stats.totalScans) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Backup Button */}
        <div className="mt-6">
          <button
            onClick={handleBackup}
            disabled={stats.totalScans === 0}
            className={`
              w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3
              transition-all duration-300 shadow-lg hover:shadow-xl
              ${needsBackup 
                ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700 animate-pulse-slow' 
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'}
              disabled:opacity-50 disabled:cursor-not-allowed disabled:animate-none
            `}
          >
            <Download size={24} />
            <span>{needsBackup ? 'Backup Recommended!' : 'Download Backup'}</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulseSlow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
