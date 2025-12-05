/**
 * InsightsCard Component
 * Displays RAG-generated intelligent insights for skin lesion analysis
 */

import { AlertCircle, CheckCircle, Info, Lightbulb, Shield } from 'lucide-react';

export interface Insight {
  explanation: string;
  keyFindings: Array<{
    category: string;
    finding: string;
    confidence: string | null;
  }>;
  medicalContext: {
    lesionType: string;
    description: string;
    prevalence: string;
    riskLevel: string;
  } | null;
  recommendations: string[];
  warningSigns: {
    title: string;
    signs?: Array<{ letter: string; description: string }>;
    features?: Record<string, string>;
  } | null;
  confidenceLevel: string;
  disclaimer: string;
}

interface InsightsCardProps {
  insights: Insight;
  result: 'benign' | 'suspicious' | 'malignant';
}

export default function InsightsCard({ insights, result }: InsightsCardProps) {
  const resultConfig = {
    benign: {
      color: 'green',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      accentColor: 'text-green-600',
    },
    suspicious: {
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      textColor: 'text-yellow-900',
      accentColor: 'text-yellow-600',
    },
    malignant: {
      color: 'red',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      accentColor: 'text-red-600',
    },
  };

  const config = resultConfig[result];

  return (
    <div className="w-full max-w-[800px] mx-auto space-y-6 animate-fadeIn">
      {/* Main Explanation - User-Friendly Version */}
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Lightbulb className={config.accentColor} size={24} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${config.textColor} mb-3`}>
              What This Means For You
            </h3>
            <div className="space-y-3">
              <p className="text-gray-800 leading-relaxed font-medium">
                {insights.explanation}
              </p>
              {result === 'benign' && (
                <div className="bg-white/70 rounded-lg p-4 border-l-4 border-green-500">
                  <p className="text-sm text-gray-700">
                    <strong className="text-green-700">Good news!</strong> This appears to be a common, non-cancerous skin condition. 
                    While no immediate action is needed, continue monitoring your skin regularly.
                  </p>
                </div>
              )}
              {result === 'suspicious' && (
                <div className="bg-white/70 rounded-lg p-4 border-l-4 border-yellow-500">
                  <p className="text-sm text-gray-700">
                    <strong className="text-yellow-700">Action needed:</strong> Schedule an appointment with a dermatologist 
                    within the next 2-4 weeks for a professional evaluation. Early detection is key.
                  </p>
                </div>
              )}
              {result === 'malignant' && (
                <div className="bg-white/70 rounded-lg p-4 border-l-4 border-red-500">
                  <p className="text-sm text-gray-700">
                    <strong className="text-red-700">Urgent action required:</strong> Contact a dermatologist immediately. 
                    This scan shows concerning features that need professional medical evaluation as soon as possible.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Your Results - Simplified Medical Context */}
      {insights.medicalContext && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <Info className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Understanding Your Results
              </h3>
              <div className="space-y-4">
                <div className="bg-white/80 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium mb-2">What we detected:</p>
                  <p className="text-lg font-bold text-gray-900 mb-2">{insights.medicalContext.lesionType}</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{insights.medicalContext.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">How Common</p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      {insights.medicalContext.prevalence}
                    </p>
                  </div>
                  <div className="bg-white/80 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <p className="text-xs text-gray-600 font-semibold uppercase">Risk Level</p>
                    </div>
                    <p className="text-sm text-gray-800 font-medium">
                      {insights.medicalContext.riskLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What We Analyzed - Simplified Key Findings */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
            <CheckCircle className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">
              What We Analyzed
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Our AI examined these key characteristics of your skin
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.keyFindings.map((finding, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-colors">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 font-semibold uppercase mb-1">
                    {finding.category}
                  </p>
                  <p className="text-sm text-gray-900 font-medium leading-relaxed">
                    {finding.finding}
                  </p>
                  {finding.confidence && (
                    <p className="text-xs text-gray-500 mt-2 italic">
                      {finding.confidence}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Warning Signs (for suspicious/malignant) */}
      {insights.warningSigns && (
        <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
          <div className="flex items-start gap-4">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <AlertCircle className={config.accentColor} size={24} />
            </div>
            <div className="flex-1">
              <h3 className={`text-xl font-bold ${config.textColor} mb-4`}>
                {insights.warningSigns.title}
              </h3>
              
              {/* ABCDE Signs */}
              {insights.warningSigns.signs && (
                <div className="space-y-3">
                  {insights.warningSigns.signs.map((sign, index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg">
                      <span className={`font-bold ${config.textColor} text-lg`}>
                        {sign.letter}:
                      </span>
                      <span className="text-gray-700 ml-2">{sign.description}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Critical Features */}
              {insights.warningSigns.features && (
                <div className="space-y-2">
                  {Object.entries(insights.warningSigns.features).map(([key, value], index) => (
                    <div key={index} className="bg-white/70 p-3 rounded-lg">
                      <span className={`font-semibold ${config.textColor} capitalize`}>
                        {key}:
                      </span>
                      <span className="text-gray-700 ml-2">{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Your Next Steps - More Actionable */}
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 border-2 border-indigo-300 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Lightbulb className="text-indigo-600" size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-indigo-900 mb-2">
              Your Next Steps
            </h3>
            <p className="text-sm text-indigo-700 mb-4">
              Here's what you should do based on your scan results
            </p>
            <div className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="bg-white/80 rounded-lg p-4 border-l-4 border-indigo-500 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-7 h-7 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{index + 1}</span>
                    </div>
                    <p className="text-gray-800 flex-1 font-medium leading-relaxed">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-3">
          <Shield className="text-gray-500 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-semibold text-gray-600 uppercase mb-1">
              Important Disclaimer
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              {insights.disclaimer}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 600ms ease-out;
        }
      `}</style>
    </div>
  );
}
