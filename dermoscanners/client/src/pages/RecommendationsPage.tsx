/**
 * RecommendationsPage - MAJOR VISUAL IMPACT FEATURE
 * Issue #54: Recommendation Data File Update
 * Displays all health recommendations with version tracking and management
 */

import { useState, useEffect } from 'react';
import { BookOpen, Download, RefreshCw, CheckCircle2, AlertCircle, Info, TrendingUp, Calendar, Shield, Award } from 'lucide-react';
import api from '../services/api';

interface Recommendation {
  title: string;
  riskLevel: string;
  urgency: string;
  tips: string[];
  nextSteps: string;
  estimatedFollowUp: string;
}

interface RecommendationsData {
  version: string;
  lastUpdated: string;
  totalRecommendations: number;
  dataSource: string;
  recommendations: {
    benign: Recommendation;
    suspicious: Recommendation;
    malignant: Recommendation;
  };
  metadata: {
    createdBy: string;
    reviewedBy: string;
    nextReview: string;
    complianceStandards: string[];
  };
}

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'benign' | 'suspicious' | 'malignant'>('benign');

  const fetchRecommendations = async (showRefresh = false) => {
    try {
      if (showRefresh) setRefreshing(true);
      else setLoading(true);
      
      const response = await api.get<RecommendationsData>('/ai/recommendations');
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const handleExportAll = () => {
    if (!data) return;
    
    const content = `
DermoScanner Complete Health Recommendations Database
Version: ${data.version}
Last Updated: ${data.lastUpdated}
Data Source: ${data.dataSource}
Total Recommendations: ${data.totalRecommendations}

===========================================
BENIGN (LOW RISK)
===========================================
${data.recommendations.benign.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
Next Steps: ${data.recommendations.benign.nextSteps}
Follow-up: ${data.recommendations.benign.estimatedFollowUp}

===========================================
SUSPICIOUS (MODERATE RISK)
===========================================
${data.recommendations.suspicious.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
Next Steps: ${data.recommendations.suspicious.nextSteps}
Follow-up: ${data.recommendations.suspicious.estimatedFollowUp}

===========================================
MALIGNANT (HIGH RISK)
===========================================
${data.recommendations.malignant.tips.map((tip, i) => `${i + 1}. ${tip}`).join('\n')}
Next Steps: ${data.recommendations.malignant.nextSteps}
Follow-up: ${data.recommendations.malignant.estimatedFollowUp}

===========================================
METADATA
===========================================
Created By: ${data.metadata.createdBy}
Reviewed By: ${data.metadata.reviewedBy}
Next Review: ${data.metadata.nextReview}
Compliance: ${data.metadata.complianceStandards.join(', ')}

DISCLAIMER: These recommendations are for informational purposes only.
Always consult with a qualified healthcare professional.
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dermoscanner-complete-recommendations-v${data.version}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading recommendations database...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
          <p className="text-gray-600 font-medium">Failed to load recommendations</p>
        </div>
      </div>
    );
  }

  const categories = [
    { key: 'benign' as const, label: 'Low Risk', color: 'green', icon: CheckCircle2 },
    { key: 'suspicious' as const, label: 'Moderate Risk', color: 'yellow', icon: AlertCircle },
    { key: 'malignant' as const, label: 'High Risk', color: 'red', icon: AlertCircle },
  ];

  const selectedRec = data.recommendations[selectedCategory];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl">
                  <BookOpen className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Health Recommendations Database</h1>
                  <p className="text-gray-600 mt-1">Evidence-based guidance for skin health management</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => fetchRecommendations(true)}
                  disabled={refreshing}
                  className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-all duration-200 disabled:opacity-50"
                >
                  <RefreshCw className={refreshing ? 'animate-spin' : ''} size={18} />
                  <span className="font-semibold">Refresh</span>
                </button>
                <button
                  onClick={handleExportAll}
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
                >
                  <Download size={18} />
                  <span className="font-semibold">Export All</span>
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border-2 border-blue-200">
                <div className="flex items-center gap-3">
                  <Award className="text-blue-600" size={24} />
                  <div>
                    <p className="text-sm text-blue-600 font-semibold">Version</p>
                    <p className="text-2xl font-bold text-blue-800">v{data.version}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-green-600" size={24} />
                  <div>
                    <p className="text-sm text-green-600 font-semibold">Total Tips</p>
                    <p className="text-2xl font-bold text-green-800">{data.totalRecommendations}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border-2 border-purple-200">
                <div className="flex items-center gap-3">
                  <Calendar className="text-purple-600" size={24} />
                  <div>
                    <p className="text-sm text-purple-600 font-semibold">Last Updated</p>
                    <p className="text-lg font-bold text-purple-800">{new Date(data.lastUpdated).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border-2 border-orange-200">
                <div className="flex items-center gap-3">
                  <Shield className="text-orange-600" size={24} />
                  <div>
                    <p className="text-sm text-orange-600 font-semibold">Compliance</p>
                    <p className="text-sm font-bold text-orange-800">{data.metadata.complianceStandards.length} Standards</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Source Badge */}
            <div className="mt-4 bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border-2 border-indigo-200">
              <div className="flex items-center gap-2">
                <Info className="text-indigo-600" size={20} />
                <p className="text-sm text-indigo-800">
                  <span className="font-bold">Data Source:</span> {data.dataSource} | 
                  <span className="font-bold ml-2">Reviewed By:</span> {data.metadata.reviewedBy}
                </p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-4 mb-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex-1 flex items-center justify-center gap-3 py-4 px-6 rounded-xl font-bold transition-all duration-300 ${
                    isSelected
                      ? `bg-${cat.color}-500 text-white shadow-2xl scale-105`
                      : `bg-white text-gray-600 hover:bg-${cat.color}-50 shadow-lg`
                  }`}
                >
                  <Icon size={24} />
                  <span className="text-lg">{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Recommendations Display */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedRec.title}</h2>
            <div className="flex gap-4 mb-6">
              <span className={`px-4 py-1 rounded-full text-sm font-bold ${
                selectedRec.urgency === 'immediate' ? 'bg-red-100 text-red-700' :
                selectedRec.urgency === 'prompt' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                Urgency: {selectedRec.urgency.toUpperCase()}
              </span>
              <span className="px-4 py-1 rounded-full text-sm font-bold bg-blue-100 text-blue-700">
                Follow-up: {selectedRec.estimatedFollowUp}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              {selectedRec.tips.map((tip, index) => (
                <div key={index} className="flex items-start gap-4 bg-gray-50 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-200">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <p className="text-gray-700 leading-relaxed flex-1">{tip}</p>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border-2 border-blue-200">
              <h3 className="font-bold text-gray-800 mb-2">Next Steps:</h3>
              <p className="text-gray-700">{selectedRec.nextSteps}</p>
            </div>
          </div>

          {/* Compliance Footer */}
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6">
            <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Shield className="text-green-600" size={20} />
              Compliance & Standards
            </h3>
            <div className="flex flex-wrap gap-2">
              {data.metadata.complianceStandards.map((standard, index) => (
                <span key={index} className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-semibold text-sm">
                  ✓ {standard}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Next Review Date: <span className="font-bold">{new Date(data.metadata.nextReview).toLocaleDateString()}</span>
            </p>
          </div>
        </div>
      </div>
  );
}
