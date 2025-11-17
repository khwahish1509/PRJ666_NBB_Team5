/**
 * FeaturesShowcasePage Component
 * Visual showcase of all Sprint 3 features
 * Demonstrates impact of each GitHub issue
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Brain,
  Heart,
  Database,
  Cloud,
  Rocket,
  TestTube,
  Monitor,
  BookOpen,
  Users,
  Sparkles,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';

interface Feature {
  id: number;
  issue: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  demoPath?: string;
  highlights: string[];
  impact: string;
}

const features: Feature[] = [
  {
    id: 1,
    issue: 'Issue #1',
    title: 'AI Scan Workflow',
    description: 'Mock AI model with real-time processing visualization',
    icon: Brain,
    color: 'from-purple-500 to-pink-500',
    gradient: 'from-purple-50 to-pink-50',
    demoPath: '/scan',
    highlights: [
      'Real-time processing animation with stages',
      '3-second AI inference simulation',
      'Beautiful result cards with confidence meters',
      'Error handling with user-friendly messages',
    ],
    impact: 'Users SEE the AI thinking in real-time, building trust and engagement',
  },
  {
    id: 2,
    issue: 'Issue #2',
    title: 'Result & Recommendation UI',
    description: 'Dynamic recommendations linked to AI results',
    icon: Heart,
    color: 'from-red-500 to-rose-500',
    gradient: 'from-red-50 to-rose-50',
    demoPath: '/scan',
    highlights: [
      'Color-coded risk levels (green/yellow/red)',
      'Animated confidence progress bars',
      'Personalized health recommendations',
      'Responsive design for all devices',
    ],
    impact: 'Users instantly understand their results and know what actions to take',
  },
  {
    id: 3,
    issue: 'Issue #3',
    title: 'Scan History & Backup',
    description: 'Local storage with backup/restore functionality',
    icon: Database,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'from-blue-50 to-cyan-50',
    demoPath: '/history',
    highlights: [
      'Automatic scan history persistence',
      'Visual storage usage dashboard',
      'One-click backup download (JSON)',
      'Restore from backup file',
    ],
    impact: 'Users TRUST their data is safe and can access it anytime',
  },
  {
    id: 4,
    issue: 'Issue #4',
    title: 'Cloud Database Sync',
    description: 'MongoDB Atlas integration with real-time sync',
    icon: Cloud,
    color: 'from-indigo-500 to-purple-500',
    gradient: 'from-indigo-50 to-purple-50',
    demoPath: '/dashboard',
    highlights: [
      'Real-time sync status indicator',
      'Automatic cloud backup',
      'Offline mode with queue',
      'Connection health monitoring',
    ],
    impact: 'Users SEE their data syncing to cloud, ensuring peace of mind',
  },
  {
    id: 5,
    issue: 'Issue #5',
    title: 'API Integration & Deployment',
    description: 'Full-stack deployment with live monitoring',
    icon: Rocket,
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-50 to-emerald-50',
    demoPath: '/features',
    highlights: [
      'Frontend + Backend unified deployment',
      'HTTPS secure connections',
      'Environment variable management',
      'API health monitoring',
    ],
    impact: 'Users access a live, production-ready application',
  },
  {
    id: 6,
    issue: 'Issue #6',
    title: 'End-to-End Testing',
    description: 'Comprehensive test coverage with visual results',
    icon: TestTube,
    color: 'from-teal-500 to-cyan-500',
    gradient: 'from-teal-50 to-cyan-50',
    demoPath: '/features',
    highlights: [
      'Jest unit tests for all components',
      'Integration tests for workflows',
      'Visual test coverage dashboard',
      'QA report with all scenarios',
    ],
    impact: 'Users TRUST the app is thoroughly tested and reliable',
  },
  {
    id: 7,
    issue: 'Issue #7',
    title: 'Browser & Device Compatibility',
    description: 'Cross-platform support with responsive design',
    icon: Monitor,
    color: 'from-orange-500 to-amber-500',
    gradient: 'from-orange-50 to-amber-50',
    demoPath: '/features',
    highlights: [
      'Works on Chrome, Safari, Firefox, Edge',
      'Mobile-first responsive design',
      'Tablet and desktop optimized',
      'Touch and mouse interactions',
    ],
    impact: 'Users can access the app on ANY device, anywhere',
  },
  {
    id: 8,
    issue: 'Issue #8',
    title: 'Recommendation Data',
    description: 'Dynamic health recommendations with versioning',
    icon: BookOpen,
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-50 to-rose-50',
    demoPath: '/scan',
    highlights: [
      'Structured JSON recommendation database',
      'Version tracking (v1.0)',
      'Dynamic fetching from API',
      'Fallback for offline mode',
    ],
    impact: 'Users receive accurate, up-to-date medical guidance',
  },
  {
    id: 9,
    issue: 'Issue #9',
    title: 'Persona-Based Demo',
    description: 'Story-driven demonstration with Sarah',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    gradient: 'from-violet-50 to-purple-50',
    demoPath: '/demo',
    highlights: [
      'Interactive demo mode',
      'Step-by-step tutorial overlay',
      'Sample scan results',
      '7-minute presentation ready',
    ],
    impact: 'Users EXPERIENCE the full value through a relatable story',
  },
];

export default function FeaturesShowcasePage() {
  const navigate = useNavigate();
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block mb-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-5 rounded-3xl shadow-2xl">
              <Sparkles className="text-white" size={48} strokeWidth={2} />
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Sprint 3 Features Showcase
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every GitHub issue transformed into a visible, impactful user experience
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.id}
                className="feature-card group cursor-pointer"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedFeature(feature)}
              >
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 border-2 border-gray-200 hover:border-indigo-300 shadow-lg hover:shadow-2xl transition-all duration-300 h-full`}>
                  {/* Icon */}
                  <div className={`bg-gradient-to-br ${feature.color} p-4 rounded-2xl shadow-lg mb-4 inline-block group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="text-white" size={32} strokeWidth={2.5} />
                  </div>

                  {/* Issue Badge */}
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 mb-3 shadow-sm">
                    {feature.issue}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </p>

                  {/* Highlights Count */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{feature.highlights.length} key features</span>
                  </div>

                  {/* Hover Arrow */}
                  <div className="mt-4 flex items-center gap-2 text-indigo-600 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>View Details</span>
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats Summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 shadow-2xl text-white mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center">Sprint 3 Impact Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">9</div>
              <div className="text-sm opacity-90">GitHub Issues</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-sm opacity-90">Visual Impact</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">35+</div>
              <div className="text-sm opacity-90">Key Features</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold mb-2">A+</div>
              <div className="text-sm opacity-90">User Experience</div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/scan')}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
          >
            <Sparkles size={28} />
            <span>Try Live Demo</span>
            <ArrowRight size={28} />
          </button>
        </div>
      </div>

      {/* Feature Detail Modal */}
      {selectedFeature && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelectedFeature(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`bg-gradient-to-br ${selectedFeature.gradient} p-8 border-b-2 border-gray-200`}>
              <div className="flex items-start gap-4 mb-4">
                <div className={`bg-gradient-to-br ${selectedFeature.color} p-4 rounded-2xl shadow-lg`}>
                  <selectedFeature.icon className="text-white" size={40} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <div className="inline-block bg-white px-3 py-1 rounded-full text-xs font-bold text-gray-700 mb-2 shadow-sm">
                    {selectedFeature.issue}
                  </div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">
                    {selectedFeature.title}
                  </h2>
                  <p className="text-gray-600">{selectedFeature.description}</p>
                </div>
              </div>
            </div>

            <div className="p-8">
              {/* Impact Statement */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <Sparkles className="text-green-600 flex-shrink-0 mt-1" size={24} />
                  <div>
                    <h3 className="font-bold text-green-900 mb-2">User Impact</h3>
                    <p className="text-green-800">{selectedFeature.impact}</p>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Key Features</h3>
                <div className="space-y-3">
                  {selectedFeature.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-start gap-3 bg-gray-50 rounded-lg p-3">
                      <CheckCircle className="text-green-500 flex-shrink-0 mt-0.5" size={20} />
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {selectedFeature.demoPath && (
                  <button
                    onClick={() => navigate(selectedFeature.demoPath!)}
                    className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    Try Feature
                  </button>
                )}
                <button
                  onClick={() => setSelectedFeature(null)}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes featureCard {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fade-in {
          animation: fadeIn 600ms ease-out;
        }

        .feature-card {
          animation: featureCard 500ms ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scaleIn 300ms ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
