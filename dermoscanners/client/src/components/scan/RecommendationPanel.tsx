/**
 * RecommendationPanel Component - ENHANCED WITH MAJOR VISUAL IMPACT
 * Issue #54: Recommendation Data File Update
 * Displays personalized health recommendations with version tracking and export features
 */

import { useState, useEffect } from 'react';
import { Info, AlertCircle, CheckCircle2, Lightbulb, Heart, Shield, Calendar, Stethoscope, Download, Share2, BookOpen, Clock, TrendingUp } from 'lucide-react';
import api from '../../services/api';

export interface RecommendationPanelProps {
  result: 'benign' | 'suspicious' | 'malignant';
}

interface Recommendation {
  title: string;
  tips: string[];
}

interface RecommendationsData {
  version: string;
  recommendations: {
    benign: Recommendation;
    suspicious: Recommendation;
    malignant: Recommendation;
  };
  lastUpdated?: string;
}

export default function RecommendationPanel({ result }: RecommendationPanelProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [version, setVersion] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showExportSuccess, setShowExportSuccess] = useState(false);
  const [checkedTips, setCheckedTips] = useState<Set<number>>(new Set());

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(false);
        
        // Fetch recommendations from server (correct endpoint: /ai/recommendations)
        const response = await api.get<RecommendationsData>('/ai/recommendations');
        
        // Map result type to corresponding recommendation
        const recommendationData = response.data.recommendations[result];
        setRecommendation(recommendationData);
        setVersion(response.data.version);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [result]);

  // Export recommendations as PDF/Text
  const handleExport = () => {
    if (!recommendation) return;
    
    const content = `
DermoScanner Health Recommendations
Version: ${version}
Risk Level: ${recommendation.title}
Generated: ${new Date().toLocaleDateString()}

PERSONALIZED RECOMMENDATIONS:
${recommendation.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}

DISCLAIMER: These recommendations are for informational purposes only and do not constitute medical advice.
Always consult with a qualified healthcare professional for proper diagnosis and treatment.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dermoscanner-recommendations-${result}-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportSuccess(true);
    setTimeout(() => setShowExportSuccess(false), 3000);
  };

  // Share recommendations
  const handleShare = async () => {
    if (!recommendation) return;
    
    const shareText = `DermoScanner Recommendations (${recommendation.title})\n\n${recommendation.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'DermoScanner Health Recommendations',
          text: shareText,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Recommendations copied to clipboard!');
    }
  };

  // Toggle tip completion
  const toggleTipCheck = (index: number) => {
    const newChecked = new Set(checkedTips);
    if (newChecked.has(index)) {
      newChecked.delete(index);
    } else {
      newChecked.add(index);
    }
    setCheckedTips(newChecked);
  };

  // Enhanced configuration for each result type
  const resultConfig = {
    benign: {
      icon: CheckCircle2,
      iconColor: 'text-green-600',
      bgGradient: 'from-green-50 via-emerald-50 to-teal-50',
      borderColor: 'border-green-300',
      accentColor: 'text-green-800',
      headerBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      tipIcons: [Heart, Shield, Calendar, Stethoscope],
    },
    suspicious: {
      icon: AlertCircle,
      iconColor: 'text-yellow-600',
      bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
      borderColor: 'border-yellow-300',
      accentColor: 'text-yellow-800',
      headerBg: 'bg-gradient-to-r from-yellow-500 to-amber-500',
      tipIcons: [AlertCircle, Stethoscope, Calendar, Shield],
    },
    malignant: {
      icon: AlertCircle,
      iconColor: 'text-red-600',
      bgGradient: 'from-red-50 via-rose-50 to-pink-50',
      borderColor: 'border-red-300',
      accentColor: 'text-red-800',
      headerBg: 'bg-gradient-to-r from-red-500 to-rose-500',
      tipIcons: [AlertCircle, Stethoscope, Heart, Shield],
    },
  };

  const config = resultConfig[result];
  const Icon = config.icon;

  // Loading state
  if (loading) {
    return (
      <div className="w-full max-w-[600px] mx-auto mt-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
          <div className="flex items-center justify-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-500"></div>
            <span>Loading recommendations...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state - fallback UI
  if (error || !recommendation) {
    return (
      <div className="w-full max-w-[600px] mx-auto mt-6">
        <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-6 shadow-md">
          <div className="flex items-start gap-3">
            <Info className="text-orange-600 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-lg font-bold text-orange-800 mb-2">
                Recommendations Temporarily Unavailable
              </h3>
              <p className="text-orange-700 text-sm">
                We're unable to load health recommendations at this time. 
                Please consult a healthcare professional for guidance based on your scan results.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Success state - display recommendations with MAJOR ENHANCED UI
  return (
    <div className="w-full max-w-[700px] mx-auto mt-8">
      {/* Export Success Toast */}
      {showExportSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-2xl animate-bounce">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={20} />
            <span className="font-semibold">Recommendations exported successfully!</span>
          </div>
        </div>
      )}

      <div 
        className={`
          recommendation-panel-entrance
          bg-gradient-to-br ${config.bgGradient}
          ${config.borderColor}
          border-2 rounded-2xl overflow-hidden shadow-2xl
          hover:shadow-3xl transition-all duration-300
        `}
      >
        {/* Enhanced Gradient Header with Version Badge */}
        <div className={`${config.headerBg} px-6 py-5 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-pattern"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                  <Icon className="text-white" size={28} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {recommendation.title}
                  </h3>
                  <p className="text-sm text-white/90 font-medium">
                    Personalized recommendations for your health
                  </p>
                </div>
              </div>
              {/* Version Badge - MAJOR VISUAL IMPACT */}
              <div className="bg-white/30 backdrop-blur-md px-4 py-2 rounded-full border-2 border-white/50">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-white" size={16} />
                  <span className="text-white font-bold text-sm">v{version}</span>
                </div>
              </div>
            </div>
            
            {/* Action Buttons - NEW FEATURE */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleExport}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
              >
                <Download className="text-white" size={16} />
                <span className="text-white text-sm font-semibold">Export</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 border border-white/30"
              >
                <Share2 className="text-white" size={16} />
                <span className="text-white text-sm font-semibold">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* ENHANCED Tips List with Interactive Checkboxes */}
        <div className="p-6 space-y-4">
          {/* Progress Indicator - NEW FEATURE */}
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-blue-600" size={18} />
                <span className="text-sm font-bold text-gray-700">Your Progress</span>
              </div>
              <span className="text-sm font-bold text-blue-600">
                {checkedTips.size} / {recommendation.tips.length} completed
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`${config.headerBg} h-2.5 rounded-full transition-all duration-500`}
                style={{ width: `${(checkedTips.size / recommendation.tips.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {recommendation.tips.map((tip, index) => {
            const TipIcon = config.tipIcons[index % config.tipIcons.length];
            const isChecked = checkedTips.has(index);
            return (
              <div 
                key={index}
                className={`tip-card-entrance bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer ${
                  isChecked ? 'border-green-400 bg-green-50/80' : 'border-white'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => toggleTipCheck(index)}
              >
                <div className="flex items-start gap-4">
                  {/* Interactive Checkbox - NEW FEATURE */}
                  <div className="flex-shrink-0">
                    <div 
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        isChecked 
                          ? 'bg-green-500 border-green-500' 
                          : 'bg-white border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {isChecked && <CheckCircle2 className="text-white" size={16} />}
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0">
                    <div className={`${config.headerBg} p-2.5 rounded-lg shadow-md`}>
                      <TipIcon className="text-white" size={20} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Step {index + 1}
                      </span>
                      {isChecked && (
                        <span className="text-xs font-bold text-green-600 uppercase tracking-wider">
                          ✓ Completed
                        </span>
                      )}
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${
                      isChecked ? 'text-gray-600 line-through' : 'text-gray-800'
                    }`}>
                      {tip}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Disclaimer */}
        <div className="px-6 pb-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-gray-200">
            <div className="flex items-start gap-3">
              <Info className="text-blue-500 flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  <strong className="text-gray-900">Important Disclaimer:</strong> These recommendations are for informational purposes only 
                  and do not constitute medical advice. Always consult with a qualified healthcare 
                  professional for proper diagnosis and treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes panelSlideUp {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes tipCardSlideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .recommendation-panel-entrance {
          animation: panelSlideUp 600ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .tip-card-entrance {
          animation: tipCardSlideIn 400ms ease-out forwards;
          opacity: 0;
        }

        .bg-pattern {
          background-image: 
            radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 1px, transparent 1px),
            radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
          background-size: 30px 30px;
        }

        .shadow-3xl {
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
}
