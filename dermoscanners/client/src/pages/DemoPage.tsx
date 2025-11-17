/**
 * DemoPage Component
 * Interactive demo mode with Sarah's persona story
 * Issue #9: Persona-Based Demo Preparation
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, User, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';

interface DemoStep {
  id: number;
  title: string;
  description: string;
  action: string;
  route: string;
}

const demoSteps: DemoStep[] = [
  {
    id: 1,
    title: 'Meet Sarah',
    description: 'Sarah is a 32-year-old professional who noticed a new mole on her arm.',
    action: 'Start Demo',
    route: '/demo',
  },
  {
    id: 2,
    title: 'Upload Image',
    description: 'Sarah takes a photo of the mole and uploads it to DermoScanner.',
    action: 'Go to Scan Page',
    route: '/scan',
  },
  {
    id: 3,
    title: 'AI Analysis',
    description: 'Watch as our AI analyzes the image in real-time with 4-stage processing.',
    action: 'See AI in Action',
    route: '/scan',
  },
  {
    id: 4,
    title: 'Get Results',
    description: 'Sarah receives instant results with confidence score and risk assessment.',
    action: 'View Results',
    route: '/scan',
  },
  {
    id: 5,
    title: 'Recommendations',
    description: 'Sarah gets personalized health recommendations based on her results.',
    action: 'See Recommendations',
    route: '/scan',
  },
  {
    id: 6,
    title: 'View History',
    description: 'All of Sarah\'s scans are automatically saved and accessible anytime.',
    action: 'Check History',
    route: '/history',
  },
  {
    id: 7,
    title: 'Backup Data',
    description: 'Sarah can download a backup of all her scan results for her records.',
    action: 'See Backup',
    route: '/history',
  },
];

export default function DemoPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPersona, setShowPersona] = useState(true);

  const handleStartDemo = () => {
    setShowPersona(false);
    setCurrentStep(0);
  };

  const handleNextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Demo complete, go to features page
      navigate('/features');
    }
  };

  const handleSkipToAction = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Persona Introduction */}
        {showPersona ? (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-5 rounded-3xl shadow-2xl">
                  <User className="text-white" size={48} strokeWidth={2} />
                </div>
              </div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 bg-clip-text text-transparent mb-4">
                Meet Sarah
              </h1>
              <p className="text-xl text-gray-600">
                Experience DermoScanner through her journey
              </p>
            </div>

            {/* Persona Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8 border-2 border-purple-200">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="text-white" size={48} strokeWidth={2} />
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">Sarah Johnson</h2>
                  <p className="text-lg text-gray-600 mb-4">32 years old • Marketing Professional • Active Lifestyle</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                      Health Conscious
                    </span>
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">
                      Tech Savvy
                    </span>
                    <span className="px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold">
                      Busy Schedule
                    </span>
                  </div>
                </div>
              </div>

              {/* Sarah's Story */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Sarah's Concern</h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Last week, Sarah noticed a new mole on her left arm. It looked different from her other moles - 
                  slightly darker and with an irregular border. She wanted to get it checked, but her busy work 
                  schedule made it difficult to book a dermatologist appointment.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  That's when she discovered <strong className="text-purple-600">DermoScanner</strong> - an AI-powered 
                  skin lesion analysis tool that could give her instant feedback and help her decide if she needed 
                  to see a doctor urgently.
                </p>
              </div>

              {/* What Sarah Needs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl p-4 border-2 border-purple-200 shadow-sm">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-gray-800 mb-1">Quick Results</h4>
                  <p className="text-sm text-gray-600">Instant AI analysis in seconds</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-pink-200 shadow-sm">
                  <div className="text-3xl mb-2">🎯</div>
                  <h4 className="font-bold text-gray-800 mb-1">Clear Guidance</h4>
                  <p className="text-sm text-gray-600">Actionable recommendations</p>
                </div>
                <div className="bg-white rounded-xl p-4 border-2 border-rose-200 shadow-sm">
                  <div className="text-3xl mb-2">🔒</div>
                  <h4 className="font-bold text-gray-800 mb-1">Data Safety</h4>
                  <p className="text-sm text-gray-600">Secure storage and backup</p>
                </div>
              </div>

              {/* Start Demo Button */}
              <button
                onClick={handleStartDemo}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                <Play size={28} />
                <span>Start Sarah's Journey</span>
                <ArrowRight size={28} />
              </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-purple-200">
                <div className="text-3xl font-bold text-purple-600 mb-1">3s</div>
                <div className="text-sm text-gray-600">AI Analysis Time</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-pink-200">
                <div className="text-3xl font-bold text-pink-600 mb-1">7</div>
                <div className="text-sm text-gray-600">Steps to Complete</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center shadow-lg border border-rose-200">
                <div className="text-3xl font-bold text-rose-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Data Security</div>
              </div>
            </div>
          </div>
        ) : (
          /* Demo Steps */
          <div className="animate-fade-in">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-gray-600">Demo Progress</span>
                <span className="text-sm font-bold text-purple-600">
                  Step {currentStep + 1} of {demoSteps.length}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-600 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Current Step */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-6 border-2 border-purple-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                  {currentStep + 1}
                </div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {demoSteps[currentStep].title}
                </h2>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {demoSteps[currentStep].description}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => handleSkipToAction(demoSteps[currentStep].route)}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles size={24} />
                  <span>{demoSteps[currentStep].action}</span>
                </button>
                <button
                  onClick={handleNextStep}
                  className="px-8 py-4 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center gap-2"
                >
                  <span>{currentStep === demoSteps.length - 1 ? 'Finish' : 'Next'}</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>

            {/* All Steps Overview */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-200">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Demo Journey</h3>
              <div className="space-y-3">
                {demoSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      index === currentStep
                        ? 'bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300'
                        : index < currentStep
                        ? 'bg-green-50 border border-green-200'
                        : 'bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        index < currentStep
                          ? 'bg-green-500 text-white'
                          : index === currentStep
                          ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                          : 'bg-gray-300 text-gray-600'
                      }`}
                    >
                      {index < currentStep ? <CheckCircle size={16} /> : index + 1}
                    </div>
                    <span
                      className={`font-semibold ${
                        index === currentStep ? 'text-purple-700' : 'text-gray-700'
                      }`}
                    >
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 600ms ease-out;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  );
}
