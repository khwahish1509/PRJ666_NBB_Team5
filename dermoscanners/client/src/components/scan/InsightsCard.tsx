/**
 * InsightsCard Component
 * Displays RAG-generated intelligent insights for skin lesion analysis
 */

import { BookOpen, AlertCircle, CheckCircle, Info, Lightbulb, Shield } from 'lucide-react';

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
      {/* Main Explanation */}
      <div className={`${config.bgColor} ${config.borderColor} border-2 rounded-xl p-6 shadow-lg`}>
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <BookOpen className={config.accentColor} size={24} />
          </div>
          <div className="flex-1">
            <h3 className={`text-xl font-bold ${config.textColor} mb-3`}>
              Intelligent Analysis
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {insights.explanation}
            </p>
          </div>
        </div>
      </div>

      {/* Medical Context */}
      {insights.medicalContext && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <Info className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Medical Context
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold text-gray-700">Lesion Type: </span>
                  <span className="text-gray-600">{insights.medicalContext.lesionType}</span>
                </div>
                <p className="text-gray-600">{insights.medicalContext.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium uppercase">Prevalence</p>
                    <p className="text-sm text-gray-700 font-semibold mt-1">
                      {insights.medicalContext.prevalence}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 font-medium uppercase">Risk Level</p>
                    <p className="text-sm text-gray-700 font-semibold mt-1">
                      {insights.medicalContext.riskLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Key Findings */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <div className="bg-purple-50 p-3 rounded-lg">
            <CheckCircle className="text-purple-600" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mt-2">
            Key Findings
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.keyFindings.map((finding, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-500 font-medium uppercase mb-1">
                {finding.category}
              </p>
              <p className="text-sm text-gray-800 font-semibold">
                {finding.finding}
              </p>
              {finding.confidence && (
                <p className="text-xs text-gray-600 mt-1">
                  {finding.confidence}
                </p>
              )}
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

      {/* Recommendations */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border-2 border-indigo-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <Lightbulb className="text-indigo-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-indigo-900 mb-4">
              Recommended Actions
            </h3>
            <ul className="space-y-3">
              {insights.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="bg-indigo-100 rounded-full p-1 mt-0.5">
                    <CheckCircle className="text-indigo-600" size={16} />
                  </div>
                  <span className="text-gray-700 flex-1">{rec}</span>
                </li>
              ))}
            </ul>
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
