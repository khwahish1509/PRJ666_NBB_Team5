/**
 * SyncStatusIndicator Component
 * Real-time cloud sync status display
 * Issue #4: Cloud Database Connection - Visual Impact Enhancement
 */

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, CheckCircle, AlertCircle, Wifi, WifiOff } from 'lucide-react';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

interface SyncStatusIndicatorProps {
  status?: SyncStatus;
  lastSyncTime?: Date;
  pendingCount?: number;
  compact?: boolean;
}

export default function SyncStatusIndicator({
  status = 'synced',
  lastSyncTime,
  pendingCount = 0,
  compact = false,
}: SyncStatusIndicatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState('');

  // Update time ago every minute
  useEffect(() => {
    const updateTimeAgo = () => {
      if (!lastSyncTime) {
        setTimeAgo('Never');
        return;
      }

      const seconds = Math.floor((Date.now() - lastSyncTime.getTime()) / 1000);
      
      if (seconds < 10) {
        setTimeAgo('Just now');
      } else if (seconds < 60) {
        setTimeAgo(`${seconds}s ago`);
      } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        setTimeAgo(`${minutes}m ago`);
      } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        setTimeAgo(`${hours}h ago`);
      } else {
        const days = Math.floor(seconds / 86400);
        setTimeAgo(`${days}d ago`);
      }
    };

    updateTimeAgo();
    const interval = setInterval(updateTimeAgo, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [lastSyncTime]);

  const statusConfig = {
    synced: {
      icon: Cloud,
      label: 'Synced',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      dotColor: 'bg-green-500',
      description: 'All data backed up to cloud',
    },
    syncing: {
      icon: RefreshCw,
      label: 'Syncing',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      borderColor: 'border-blue-300',
      dotColor: 'bg-blue-500',
      description: 'Uploading to cloud...',
    },
    offline: {
      icon: CloudOff,
      label: 'Offline',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      dotColor: 'bg-yellow-500',
      description: 'Changes queued for sync',
    },
    error: {
      icon: AlertCircle,
      label: 'Error',
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      dotColor: 'bg-red-500',
      description: 'Sync failed - will retry',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  // Compact version for header
  if (compact) {
    return (
      <div
        className="relative cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Compact Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border ${config.borderColor} transition-all hover:shadow-md`}>
          <div className="relative">
            <Icon
              className={`${config.color} ${status === 'syncing' ? 'animate-spin' : ''}`}
              size={16}
              strokeWidth={2.5}
            />
            <div className={`absolute -top-1 -right-1 w-2 h-2 ${config.dotColor} rounded-full ${status === 'syncing' ? 'animate-pulse' : ''}`}></div>
          </div>
          <span className={`text-xs font-semibold ${config.color}`}>
            {config.label}
          </span>
        </div>

        {/* Expanded Tooltip */}
        {isExpanded && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-gray-200 p-4 z-50 animate-slide-down">
            <div className="flex items-start gap-3 mb-3">
              <div className={`${config.bgColor} p-2 rounded-lg`}>
                <Icon className={config.color} size={20} strokeWidth={2.5} />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 mb-1">Cloud Sync</h4>
                <p className="text-xs text-gray-600">{config.description}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <span className="text-gray-600">Status:</span>
                <span className={`font-semibold ${config.color}`}>{config.label}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-gray-100">
                <span className="text-gray-600">Last Sync:</span>
                <span className="font-semibold text-gray-800">{timeAgo}</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex justify-between items-center py-1 border-t border-gray-100">
                  <span className="text-gray-600">Pending:</span>
                  <span className="font-semibold text-orange-600">{pendingCount} items</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Full version for dashboard
  return (
    <div className="sync-status-card">
      <div className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border-2 ${config.borderColor} p-6 hover:shadow-xl transition-all duration-300`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`${config.bgColor} p-3 rounded-xl shadow-md relative`}>
              <Icon
                className={`${config.color} ${status === 'syncing' ? 'animate-spin' : ''}`}
                size={24}
                strokeWidth={2.5}
              />
              <div className={`absolute -top-1 -right-1 w-3 h-3 ${config.dotColor} rounded-full ${status === 'syncing' ? 'animate-pulse' : ''} border-2 border-white`}></div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800">Cloud Sync</h3>
              <p className={`text-sm font-semibold ${config.color}`}>{config.label}</p>
            </div>
          </div>

          {/* Connection Indicator */}
          <div className="flex items-center gap-2">
            {status === 'offline' || status === 'error' ? (
              <WifiOff className="text-gray-400" size={20} />
            ) : (
              <Wifi className="text-green-500" size={20} />
            )}
          </div>
        </div>

        {/* Status Description */}
        <div className={`${config.bgColor} rounded-lg p-3 mb-4`}>
          <p className="text-sm text-gray-700">{config.description}</p>
        </div>

        {/* Sync Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-gray-200">
            <span className="text-sm text-gray-600 font-medium">Last Sync</span>
            <span className="text-sm font-bold text-gray-800">{timeAgo}</span>
          </div>

          {pendingCount > 0 && (
            <div className="flex items-center justify-between py-2 border-b border-gray-200">
              <span className="text-sm text-gray-600 font-medium">Pending Items</span>
              <span className="text-sm font-bold text-orange-600">{pendingCount}</span>
            </div>
          )}

          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-gray-600 font-medium">Connection</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 ${config.dotColor} rounded-full ${status === 'syncing' ? 'animate-pulse' : ''}`}></div>
              <span className={`text-sm font-bold ${config.color}`}>
                {status === 'offline' || status === 'error' ? 'Disconnected' : 'Connected'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {(status === 'error' || status === 'offline') && pendingCount > 0 && (
          <button className="w-full mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-lg font-semibold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all flex items-center justify-center gap-2">
            <RefreshCw size={16} />
            Retry Sync
          </button>
        )}

        {status === 'synced' && (
          <div className="mt-4 flex items-center justify-center gap-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm font-semibold">All changes saved</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-slide-down {
          animation: slideDown 200ms ease-out;
        }
      `}</style>
    </div>
  );
}
