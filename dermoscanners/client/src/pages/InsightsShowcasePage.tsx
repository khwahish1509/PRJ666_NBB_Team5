/**
 * Insights Showcase Page - Issue #64
 * Interactive demonstration of RAG-powered Intelligent Insights
 */

import { useState } from 'react';
import { Sparkles, BookOpen, Brain, Zap, Shield, TrendingUp, AlertCircle } from 'lucide-react';
import InsightsCard, { Insight } from '../components/scan/InsightsCard';
import ResultCard from '../components/scan/ResultCard';

// Mock insights data for demonstration
const mockInsights = {
  benign: {
    result: 'benign' as const,
    confidence: 0.92,
    processingTime: 3200,
    timestamp: new Date().toISOString(),
    insights: {
      explanation: "Based on the analysis with 92% confidence, this lesion strongly suggests a benign (non-cancerous) skin condition. The features observed are consistent with Seborrheic Keratosis, which is a common non-cancerous skin growth that appears as a brown, black, or tan growth with a waxy, scaly, slightly elevated appearance. Common characteristics include: Well-defined borders, Uniform color, Waxy or stuck-on appearance. Typical features of benign lesions include well-defined, regular, and smooth edges, symmetrical appearance when divided in half, and uniform color throughout, typically one shade.",
      keyFindings: [
        { category: "Classification", finding: "Benign lesion detected", confidence: "92% confidence" },
        { category: "Risk Assessment", finding: "No cancer risk", confidence: null },
        { category: "Border Analysis", finding: "Well-defined, regular, and smooth edges", confidence: null },
        { category: "Symmetry", finding: "Symmetrical appearance when divided in half", confidence: null },
        { category: "Color Pattern", finding: "Uniform color throughout, typically one shade", confidence: null }
      ],
      medicalContext: {
        lesionType: "Seborrheic Keratosis",
        description: "Common non-cancerous skin growth that appears as a brown, black, or tan growth with a waxy, scaly, slightly elevated appearance",
        prevalence: "Very common in adults over 50",
        riskLevel: "No cancer risk"
      },
      recommendations: [
        "Continue routine skin self-examinations monthly",
        "Annual dermatology check-up recommended",
        "Monitor for any changes in size, color, or shape",
        "Protect skin from excessive sun exposure",
        "Document with photos for future comparison"
      ],
      warningSigns: null,
      confidenceLevel: "Very High",
      disclaimer: "This analysis is for educational purposes only and should not be used for medical diagnosis. Always consult a qualified healthcare professional for proper evaluation and treatment."
    }
  },
  suspicious: {
    result: 'suspicious' as const,
    confidence: 0.73,
    processingTime: 3100,
    timestamp: new Date().toISOString(),
    insights: {
      explanation: "The analysis with 73% confidence may suggest a suspicious lesion that requires professional medical evaluation. The features observed are consistent with Atypical Nevus (Dysplastic Nevus), which is an unusual-looking mole that may have irregular features but is not yet cancerous. Common characteristics include: Irregular borders, Multiple colors, Larger than typical moles. Typical features of suspicious lesions show some irregularity that warrants closer examination by a healthcare professional.",
      keyFindings: [
        { category: "Classification", finding: "Suspicious lesion detected", confidence: "73% confidence" },
        { category: "Risk Assessment", finding: "Increased melanoma risk, requires monitoring", confidence: null },
        { category: "Border Analysis", finding: "Irregular borders detected", confidence: null },
        { category: "Symmetry", finding: "Some asymmetry present", confidence: null },
        { category: "Color Pattern", finding: "Multiple colors or uneven distribution", confidence: null }
      ],
      medicalContext: {
        lesionType: "Atypical Nevus (Dysplastic Nevus)",
        description: "Unusual-looking mole that may have irregular features but is not yet cancerous",
        prevalence: "5-10% of adults have at least one",
        riskLevel: "Increased melanoma risk, requires monitoring"
      },
      recommendations: [
        "Schedule dermatologist appointment within 2-4 weeks",
        "Avoid further sun exposure to the area",
        "Do not attempt to remove or treat at home",
        "Document with clear photos from multiple angles"
      ],
      warningSigns: {
        title: "ABCDE Warning Signs Detected",
        signs: [
          { letter: "A", description: "Asymmetry - One half doesn't match the other half" },
          { letter: "B", description: "Border irregularity - Edges are ragged, notched, or blurred" },
          { letter: "C", description: "Color variation - Multiple colors or uneven distribution" },
          { letter: "D", description: "Diameter - Larger than 6mm (pencil eraser size)" },
          { letter: "E", description: "Evolution - Changes in size, shape, color, or symptoms" }
        ]
      },
      confidenceLevel: "Moderate",
      disclaimer: "This analysis is for educational purposes only and should not be used for medical diagnosis. Always consult a qualified healthcare professional for proper evaluation and treatment."
    }
  },
  malignant: {
    result: 'malignant' as const,
    confidence: 0.88,
    processingTime: 3300,
    timestamp: new Date().toISOString(),
    insights: {
      explanation: "With 88% confidence, this analysis indicates characteristics consistent with a potentially malignant lesion requiring immediate medical attention. The features observed are consistent with Melanoma, which is the most serious type of skin cancer that develops in melanocytes. Common characteristics include: Asymmetrical shape, Irregular borders, Multiple colors. This requires urgent professional evaluation and should not be delayed.",
      keyFindings: [
        { category: "Classification", finding: "Malignant lesion detected", confidence: "88% confidence" },
        { category: "Risk Assessment", finding: "High risk, can spread to other organs if untreated", confidence: null },
        { category: "Border Analysis", finding: "Highly irregular borders, multiple colors, asymmetrical", confidence: null },
        { category: "Texture", finding: "May be raised, ulcerated, or bleeding", confidence: null },
        { category: "Evolution", finding: "Rapid or noticeable changes in size or appearance", confidence: null }
      ],
      medicalContext: {
        lesionType: "Melanoma",
        description: "Most serious type of skin cancer that develops in melanocytes",
        prevalence: "1 in 27 men and 1 in 40 women will develop melanoma",
        riskLevel: "High risk, can spread to other organs if untreated"
      },
      recommendations: [
        "Schedule dermatologist appointment immediately (within 1-2 weeks)",
        "Request urgent evaluation if rapidly changing",
        "Prepare medical history including sun exposure and family history",
        "Document all symptoms and timeline of changes",
        "Do not delay - early detection significantly improves outcomes"
      ],
      warningSigns: {
        title: "Critical Features Identified",
        features: {
          appearance: "Highly irregular borders, multiple colors, asymmetrical",
          texture: "May be raised, ulcerated, or bleeding",
          symptoms: "May itch, hurt, or bleed spontaneously",
          growth: "Rapid or noticeable changes in size or appearance"
        }
      },
      confidenceLevel: "High",
      disclaimer: "This analysis is for educational purposes only and should not be used for medical diagnosis. Always consult a qualified healthcare professional for proper evaluation and treatment."
    }
  }
};

export default function InsightsShowcasePage() {
  const [selectedType, setSelectedType] = useState<'benign' | 'suspicious' | 'malignant'>('benign');
  const [showComparison, setShowComparison] = useState(false);

  const currentExample = mockInsights[selectedType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles size={40} className="animate-pulse" />
            <h1 className="text-5xl font-bold">Intelligent Insights</h1>
          </div>
          <p className="text-xl text-center text-white/90 mb-8 max-w-3xl mx-auto">
            Experience the power of RAG (Retrieval-Augmented Generation) technology that transforms 
            raw AI confidence scores into comprehensive, human-readable medical insights.
          </p>
          
          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Brain className="mx-auto mb-2" size={32} />
              <h3 className="font-bold mb-1">AI-Powered</h3>
              <p className="text-sm text-white/80">Advanced RAG technology</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <BookOpen className="mx-auto mb-2" size={32} />
              <h3 className="font-bold mb-1">Educational</h3>
              <p className="text-sm text-white/80">Learn about your skin health</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Zap className="mx-auto mb-2" size={32} />
              <h3 className="font-bold mb-1">Instant</h3>
              <p className="text-sm text-white/80">Results in seconds</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Shield className="mx-auto mb-2" size={32} />
              <h3 className="font-bold mb-1">Safe</h3>
              <p className="text-sm text-white/80">Evidence-based guidance</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Toggle Comparison View */}
        <div className="flex justify-center mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="bg-white border-2 border-indigo-600 text-indigo-600 px-8 py-3 rounded-xl font-semibold hover:bg-indigo-50 transition shadow-lg flex items-center gap-2"
          >
            <TrendingUp size={20} />
            {showComparison ? 'Hide' : 'Show'} Before/After Comparison
          </button>
        </div>

        {/* Before/After Comparison */}
        {showComparison && (
          <div className="mb-12 bg-white rounded-2xl shadow-2xl p-8 border-2 border-indigo-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
              The Transformation: Before vs After Issue #64
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* BEFORE */}
              <div>
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-4">
                  <h3 className="text-xl font-bold text-red-900 mb-2 flex items-center gap-2">
                    <AlertCircle size={24} />
                    BEFORE - Limited Information
                  </h3>
                  <p className="text-sm text-red-700">Users only saw basic classification</p>
                </div>
                
                <div className="bg-gray-100 rounded-xl p-6 border-2 border-gray-300">
                  <div className="bg-green-100 border-2 border-green-300 rounded-lg p-4 mb-3">
                    <h4 className="font-bold text-green-900">Benign - Low Risk</h4>
                    <p className="text-sm text-green-700">No immediate concerns detected</p>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Confidence:</span>
                      <span className="font-bold">85%</span>
                    </div>
                    <div className="w-full bg-gray-300 rounded-full h-3">
                      <div className="bg-green-500 h-3 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <div className="flex justify-between pt-2">
                      <span className="text-gray-600">Processing Time:</span>
                      <span className="font-bold">3.2s</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                    <p className="text-sm text-red-800 font-semibold mb-2">❌ What's Missing:</p>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li>• No explanation of what this means</li>
                      <li>• No medical context or lesion type</li>
                      <li>• No actionable recommendations</li>
                      <li>• No educational content</li>
                      <li>• Users left confused and anxious</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AFTER */}
              <div>
                <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 mb-4">
                  <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-2">
                    <Sparkles size={24} />
                    AFTER - Comprehensive Insights
                  </h3>
                  <p className="text-sm text-green-700">Full RAG-powered intelligent report</p>
                </div>
                
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300">
                  <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                    <h4 className="font-bold text-green-900 mb-2">📖 Intelligent Analysis</h4>
                    <p className="text-xs text-gray-700 leading-relaxed">
                      "Based on the analysis with 85% confidence, this lesion strongly suggests 
                      a benign condition. Features consistent with Seborrheic Keratosis..."
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                    <h4 className="font-bold text-blue-900 mb-2">ℹ️ Medical Context</h4>
                    <p className="text-xs text-gray-700">
                      <strong>Type:</strong> Seborrheic Keratosis<br />
                      <strong>Risk:</strong> No cancer risk<br />
                      <strong>Prevalence:</strong> Very common in adults over 50
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-3 shadow-sm">
                    <h4 className="font-bold text-purple-900 mb-2">✅ Key Findings</h4>
                    <p className="text-xs text-gray-700">
                      5 detailed findings including border analysis, symmetry, color pattern
                    </p>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <h4 className="font-bold text-indigo-900 mb-2">💡 Recommendations</h4>
                    <p className="text-xs text-gray-700">
                      5 actionable steps for monitoring and prevention
                    </p>
                  </div>
                  
                  <div className="mt-4 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                    <p className="text-sm text-green-800 font-semibold mb-2">✅ Now Includes:</p>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Full plain-English explanation</li>
                      <li>• Medical context and lesion type</li>
                      <li>• Detailed key findings breakdown</li>
                      <li>• Actionable recommendations</li>
                      <li>• Educational content + safety disclaimers</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interactive Demo Section */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
            Interactive Demo: Try Different Scenarios
          </h2>
          
          <p className="text-center text-gray-600 mb-8">
            Select a lesion type to see how our RAG system generates tailored insights for each scenario
          </p>

          {/* Type Selector */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <button
              onClick={() => setSelectedType('benign')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedType === 'benign'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🟢 Benign Example
            </button>
            <button
              onClick={() => setSelectedType('suspicious')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedType === 'suspicious'
                  ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🟡 Suspicious Example
            </button>
            <button
              onClick={() => setSelectedType('malignant')}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
                selectedType === 'malignant'
                  ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              🔴 Malignant Example
            </button>
          </div>

          {/* Result Display */}
          <div className="space-y-6">
            <ResultCard
              result={currentExample.result}
              confidence={currentExample.confidence}
              processingTime={currentExample.processingTime}
              timestamp={currentExample.timestamp}
            />

            {currentExample.insights && (
              <InsightsCard
                insights={currentExample.insights}
                result={currentExample.result}
              />
            )}
          </div>
        </div>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-2xl p-8 text-white">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why This Matters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-3">Educational</h3>
              <p className="text-white/90">
                Learn about skin lesions, ABCDE criteria, risk factors, and prevention. 
                Empower yourself with knowledge.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Actionable</h3>
              <p className="text-white/90">
                Get clear, specific recommendations tailored to your result severity. 
                Know exactly what to do next.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Trustworthy</h3>
              <p className="text-white/90">
                Based on medical literature from AAD, NCI, WHO, and Skin Cancer Foundation. 
                Evidence-based insights you can trust.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            Ready to Try It Yourself?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Upload your own image and experience the power of intelligent insights
          </p>
          <a
            href="/scan"
            className="inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition shadow-lg hover:shadow-xl"
          >
            Go to Scan Page →
          </a>
        </div>
      </div>
    </div>
  );
}
