/**
 * ResultCard Component - Enhanced UI
 * Displays AI scan results with beautiful animations and color-coded classification
 */

import { CheckCircle, AlertTriangle, XCircle, Clock, Sparkles, TrendingUp } from 'lucide-react';

export interface ResultCardProps {
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  processingTime: number;
  timestamp: string;
}

export default function ResultCard({ 
  result, 
  confidence, 
  processingTime, 
  timestamp 
}: ResultCardProps) {
  // Enhanced configuration for each result type
  const resultConfig = {
    benign: {
      label: 'Benign - Low Risk',
      description: 'No immediate concerns detected',
      color: 'green',
      bgGradient: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-300',
      textColor: 'text-green-900',
      badgeBg: 'bg-gradient-to-br from-green-100 to-emerald-100',
      progressColor: 'bg-gradient-to-r from-green-400 to-emerald-500',
      glowColor: 'shadow-green-200',
      icon: CheckCircle,
      iconColor: 'text-green-600',
    },
    suspicious: {
      label: 'Suspicious - Moderate Risk',
      description: 'Requires medical attention',
      color: 'yellow',
      bgGradient: 'from-yellow-50 to-amber-50',
      borderColor: 'border-yellow-300',
      textColor: 'text-yellow-900',
      badgeBg: 'bg-gradient-to-br from-yellow-100 to-amber-100',
      progressColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      glowColor: 'shadow-yellow-200',
      icon: AlertTriangle,
      iconColor: 'text-yellow-600',
    },
    malignant: {
      label: 'Malignant - High Risk',
      description: 'Seek immediate medical care',
      color: 'red',
      bgGradient: 'from-red-50 to-rose-50',
      borderColor: 'border-red-300',
      textColor: 'text-red-900',
      badgeBg: 'bg-gradient-to-br from-red-100 to-rose-100',
      progressColor: 'bg-gradient-to-r from-red-400 to-rose-500',
      glowColor: 'shadow-red-200',
      icon: XCircle,
      iconColor: 'text-red-600',
    },
  };

  const config = resultConfig[result];
  const Icon = config.icon;
  const confidencePercentage = Math.round(confidence * 100);

  // Get confidence level description
  const getConfidenceLevel = (conf: number) => {
    if (conf >= 0.9) return { label: 'Very High', color: 'text-green-700' };
    if (conf >= 0.75) return { label: 'High', color: 'text-blue-700' };
    if (conf >= 0.6) return { label: 'Moderate', color: 'text-yellow-700' };
    return { label: 'Low', color: 'text-orange-700' };
  };

  const confidenceLevel = getConfidenceLevel(confidence);

  // Format timestamp
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
    <div 
      className={`
        result-card-entrance
        w-full max-w-[650px] mx-auto
        bg-gradient-to-br ${config.bgGradient}
        ${config.borderColor} ${config.glowColor}
        border-2 rounded-2xl p-8
        shadow-2xl hover:shadow-3xl
        transition-all duration-300
        relative overflow-hidden
      `}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-pattern"></div>
      </div>

      {/* Success sparkle animation */}
      {result === 'benign' && (
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles className="text-green-400" size={24} />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">
        {/* Classification Badge */}
        <div className="flex items-start gap-4 mb-6">
          <div className={`${config.badgeBg} p-3 rounded-2xl shadow-lg icon-bounce`}>
            <Icon className={config.iconColor} size={32} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h3 className={`text-2xl font-bold ${config.textColor} mb-1`}>
              {config.label}
            </h3>
            <p className="text-sm text-gray-600 font-medium">
              {config.description}
            </p>
          </div>
        </div>

        {/* Confidence Meter */}
        <div className="mb-6 bg-white/60 backdrop-blur-sm rounded-xl p-4 shadow-inner">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-600" />
              <span className="text-sm font-semibold text-gray-700">
                Confidence Level
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${confidenceLevel.color} px-2 py-1 rounded-full bg-white`}>
                {confidenceLevel.label}
              </span>
              <span className={`text-2xl font-bold ${config.textColor}`}>
                {confidencePercentage}%
              </span>
            </div>
          </div>
          
          {/* Enhanced progress bar with animation */}
          <div className="relative w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
            <div
              className={`
                ${config.progressColor} h-full rounded-full 
                progress-bar-fill
                relative overflow-hidden
              `}
              style={{ width: `${confidencePercentage}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer"></div>
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Processing Time */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-100 p-2 rounded-lg">
                <Clock size={20} className="text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Processing Time
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {(processingTime / 1000).toFixed(2)}s
                </p>
              </div>
            </div>
          </div>

          {/* Timestamp */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <svg 
                  className="w-5 h-5 text-purple-600" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  Analyzed On
                </p>
                <p className="text-sm font-bold text-gray-800">
                  {formatTimestamp(timestamp)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes iconBounce {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
        }

        @keyframes progressFill {
          from {
            width: 0%;
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }

        .result-card-entrance {
          animation: slideUp 500ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .icon-bounce {
          animation: iconBounce 600ms ease-in-out;
        }

        .progress-bar-fill {
          animation: progressFill 1s ease-out;
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

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0, 0, 0, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.03) 1px, transparent 1px);
          background-size: 20px 20px;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
