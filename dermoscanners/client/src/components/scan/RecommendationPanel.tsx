/**
 * RecommendationPanel Component - Enhanced UI
 * Displays beautiful health recommendations based on scan results
 */

import { useState, useEffect } from 'react';
import { Info, AlertCircle, CheckCircle2, Lightbulb, Heart, Shield, Calendar, Stethoscope } from 'lucide-react';
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
}

export default function RecommendationPanel({ result }: RecommendationPanelProps) {
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [result]);

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

  // Success state - display recommendations with enhanced UI
  return (
    <div className="w-full max-w-[650px] mx-auto mt-8">
      <div 
        className={`
          recommendation-panel-entrance
          bg-gradient-to-br ${config.bgGradient}
          ${config.borderColor}
          border-2 rounded-2xl overflow-hidden shadow-2xl
          hover:shadow-3xl transition-all duration-300
        `}
      >
        {/* Gradient Header */}
        <div className={`${config.headerBg} px-6 py-5 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-pattern"></div>
          </div>
          <div className="relative z-10 flex items-center gap-4">
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
        </div>

        {/* Tips List with enhanced styling */}
        <div className="p-6 space-y-4">
          {recommendation.tips.map((tip, index) => {
            const TipIcon = config.tipIcons[index % config.tipIcons.length];
            return (
              <div 
                key={index}
                className="tip-card-entrance bg-white/80 backdrop-blur-sm rounded-xl p-4 border-2 border-white shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-start gap-4">
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
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed font-medium">
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
