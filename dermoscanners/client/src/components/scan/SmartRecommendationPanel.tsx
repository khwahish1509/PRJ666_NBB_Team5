/**
 * Smart Recommendation Panel - COMPLETELY REDESIGNED
 * Dynamic, personalized recommendations based on scan results and user history
 */

import { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle2, Clock, Calendar, 
  MapPin, Phone, TrendingUp, Zap, Target, Shield,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getScans } from '../../utils/scanStorage';

interface SmartRecommendationProps {
  result: 'benign' | 'suspicious' | 'malignant';
  confidence: number;
  timestamp: string;
}

export default function SmartRecommendationPanel({ result, confidence, timestamp }: SmartRecommendationProps) {
  const navigate = useNavigate();
  const [userScans, setUserScans] = useState<any[]>([]);
  const [showAllActions, setShowAllActions] = useState(false);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load user's scan history for personalization
    const scans = getScans();
    setUserScans(scans);
    
    // Load completed actions from localStorage
    const saved = localStorage.getItem(`completed-actions-${result}`);
    if (saved) {
      setCompletedActions(new Set(JSON.parse(saved)));
    }
  }, [result]);

  const toggleAction = (actionId: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionId)) {
      newCompleted.delete(actionId);
    } else {
      newCompleted.add(actionId);
    }
    setCompletedActions(newCompleted);
    localStorage.setItem(`completed-actions-${result}`, JSON.stringify([...newCompleted]));
  };

  // Calculate days since scan
  const daysSinceScan = Math.floor((Date.now() - new Date(timestamp).getTime()) / (1000 * 60 * 60 * 24));
  
  // Check if user has had similar results before
  const similarScans = userScans.filter(s => s.result === result).length;
  const isFirstScan = userScans.length === 1;

  // Dynamic recommendations based on result type
  const getRecommendations = () => {
    const base = {
      benign: {
        urgency: 'routine',
        urgencyColor: 'green',
        timeframe: '12 months',
        icon: CheckCircle2,
        primaryAction: {
          id: 'monitor',
          title: 'Keep Monitoring',
          description: 'Check this area monthly for any changes',
          actionText: 'Set Monthly Reminder',
          icon: Calendar,
          urgent: false
        },
        actions: [
          {
            id: 'photo',
            title: 'Take Monthly Photos',
            description: 'Document the area to track changes over time',
            tip: 'Use the same lighting and angle each time',
            icon: Target
          },
          {
            id: 'sunscreen',
            title: 'Daily Sun Protection',
            description: 'Apply SPF 30+ sunscreen every morning',
            tip: 'Reapply every 2 hours when outdoors',
            icon: Shield
          },
          {
            id: 'checkup',
            title: 'Annual Skin Check',
            description: 'Schedule a full-body skin exam with a dermatologist',
            tip: 'Best time: Before summer or after vacation',
            icon: Calendar
          }
        ],
        insights: [
          `This is your ${isFirstScan ? 'first' : similarScans === 1 ? 'second' : `${similarScans}th`} benign result`,
          'Continue your healthy skin care routine',
          'Most benign lesions remain stable over time'
        ]
      },
      suspicious: {
        urgency: 'prompt',
        urgencyColor: 'yellow',
        timeframe: '2-4 weeks',
        icon: AlertTriangle,
        primaryAction: {
          id: 'appointment',
          title: 'Book Dermatologist Appointment',
          description: 'Schedule within the next 2-4 weeks',
          actionText: 'Find Dermatologist',
          icon: MapPin,
          urgent: true,
          onClick: () => navigate('/clinicians')
        },
        actions: [
          {
            id: 'document',
            title: 'Document Changes',
            description: 'Take photos every 3-5 days',
            tip: 'Note any changes in size, color, or shape',
            icon: Target
          },
          {
            id: 'avoid-sun',
            title: 'Protect from Sun',
            description: 'Cover the area and use SPF 50+',
            tip: 'Wear protective clothing when outdoors',
            icon: Shield
          },
          {
            id: 'prepare',
            title: 'Prepare for Appointment',
            description: 'Bring this scan result and photos',
            tip: 'Write down any questions beforehand',
            icon: Calendar
          }
        ],
        insights: [
          `Action needed within ${daysSinceScan < 7 ? 'the next 2 weeks' : 'this week'}`,
          'Early evaluation improves outcomes',
          'Bring all documentation to your appointment'
        ]
      },
      malignant: {
        urgency: 'immediate',
        urgencyColor: 'red',
        timeframe: 'Within 1 week',
        icon: AlertTriangle,
        primaryAction: {
          id: 'urgent-appointment',
          title: 'URGENT: See Dermatologist Now',
          description: 'Contact a dermatologist today or visit urgent care',
          actionText: 'Find Dermatologist Now',
          icon: Phone,
          urgent: true,
          onClick: () => navigate('/clinicians')
        },
        actions: [
          {
            id: 'call-now',
            title: 'Call Dermatologist Today',
            description: 'Explain you have concerning scan results',
            tip: 'Ask for the earliest available appointment',
            icon: Phone
          },
          {
            id: 'no-delay',
            title: 'Do Not Delay',
            description: 'Time is critical for best outcomes',
            tip: 'If no appointments available, visit urgent care',
            icon: Clock
          },
          {
            id: 'bring-results',
            title: 'Bring All Information',
            description: 'Take this scan, photos, and medical history',
            tip: 'Include any family history of skin cancer',
            icon: Target
          }
        ],
        insights: [
          '⚠️ This requires immediate medical attention',
          'Early treatment significantly improves outcomes',
          'Do not attempt self-treatment'
        ]
      }
    };

    return base[result];
  };

  const rec = getRecommendations();
  const completionRate = (completedActions.size / (rec.actions.length + 1)) * 100;

  return (
    <div className="w-full max-w-[800px] mx-auto mt-6 space-y-4">
      {/* Urgency Banner */}
      <div className={`
        ${rec.urgencyColor === 'green' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : ''}
        ${rec.urgencyColor === 'yellow' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' : ''}
        ${rec.urgencyColor === 'red' ? 'bg-gradient-to-r from-red-500 to-rose-500' : ''}
        text-white rounded-xl p-5 shadow-lg animate-slide-down
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <rec.icon size={28} className="animate-pulse" />
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide opacity-90">
                {rec.urgency} Follow-up
              </p>
              <p className="text-2xl font-bold">
                {rec.timeframe}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Your Progress</p>
            <p className="text-3xl font-bold">{Math.round(completionRate)}%</p>
          </div>
        </div>
      </div>

      {/* Primary Action Card */}
      <div className={`
        bg-white rounded-xl p-6 shadow-xl border-2
        ${rec.primaryAction.urgent ? 'border-red-300 animate-pulse-border' : 'border-gray-200'}
      `}>
        <div className="flex items-start gap-4">
          <div className={`
            p-4 rounded-xl
            ${rec.urgencyColor === 'green' ? 'bg-green-100' : ''}
            ${rec.urgencyColor === 'yellow' ? 'bg-yellow-100' : ''}
            ${rec.urgencyColor === 'red' ? 'bg-red-100' : ''}
          `}>
            <rec.primaryAction.icon size={32} className={`
              ${rec.urgencyColor === 'green' ? 'text-green-600' : ''}
              ${rec.urgencyColor === 'yellow' ? 'text-yellow-600' : ''}
              ${rec.urgencyColor === 'red' ? 'text-red-600' : ''}
            `} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {rec.primaryAction.title}
            </h3>
            <p className="text-gray-600 mb-4">
              {rec.primaryAction.description}
            </p>
            <button
              onClick={'onClick' in rec.primaryAction ? rec.primaryAction.onClick : () => toggleAction(rec.primaryAction.id)}
              className={`
                px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all
                ${rec.urgencyColor === 'green' ? 'bg-green-600 hover:bg-green-700' : ''}
                ${rec.urgencyColor === 'yellow' ? 'bg-yellow-600 hover:bg-yellow-700' : ''}
                ${rec.urgencyColor === 'red' ? 'bg-red-600 hover:bg-red-700' : ''}
                text-white shadow-lg hover:shadow-xl
              `}
            >
              {rec.primaryAction.actionText}
              <ExternalLink size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Personalized Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="text-blue-600" size={20} />
          <h4 className="font-bold text-gray-900">Personalized for You</h4>
        </div>
        <ul className="space-y-2">
          {rec.insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-blue-600 mt-0.5">•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Checklist */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-gray-900">Your Action Plan</h4>
          <button
            onClick={() => setShowAllActions(!showAllActions)}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            {showAllActions ? 'Show Less' : 'Show All'}
            {showAllActions ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        <div className="space-y-3">
          {rec.actions.slice(0, showAllActions ? undefined : 2).map((action, index) => {
            const isCompleted = completedActions.has(action.id);
            return (
              <div
                key={action.id}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all
                  ${isCompleted ? 'bg-green-50 border-green-300' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}
                `}
                onClick={() => toggleAction(action.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5
                    ${isCompleted ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}
                  `}>
                    {isCompleted && <CheckCircle2 className="text-white" size={16} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <action.icon size={18} className="text-gray-600" />
                      <h5 className={`font-semibold ${isCompleted ? 'text-gray-600 line-through' : 'text-gray-900'}`}>
                        {action.title}
                      </h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{action.description}</p>
                    <p className="text-xs text-blue-600 italic">💡 {action.tip}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Completion Progress</span>
            <span className="text-sm font-bold text-blue-600">{Math.round(completionRate)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`
                h-3 rounded-full transition-all duration-500
                ${rec.urgencyColor === 'green' ? 'bg-gradient-to-r from-green-400 to-emerald-500' : ''}
                ${rec.urgencyColor === 'yellow' ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : ''}
                ${rec.urgencyColor === 'red' ? 'bg-gradient-to-r from-red-400 to-rose-500' : ''}
              `}
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.5);
          }
          50% {
            border-color: rgba(239, 68, 68, 1);
          }
        }

        .animate-slide-down {
          animation: slide-down 500ms ease-out;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
