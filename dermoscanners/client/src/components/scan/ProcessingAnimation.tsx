/**
 * ProcessingAnimation Component
 * Real-time AI processing visualization with stages
 * Issue #1: AI Scan Workflow - Visual Impact Enhancement
 */

import { useEffect, useState } from 'react';
import { Brain, Scan, Sparkles, CheckCircle } from 'lucide-react';

interface ProcessingAnimationProps {
  onComplete?: () => void;
}

interface ProcessingStage {
  id: number;
  label: string;
  icon: React.ElementType;
  duration: number; // milliseconds
  color: string;
}

const stages: ProcessingStage[] = [
  {
    id: 1,
    label: 'Preprocessing Image',
    icon: Scan,
    duration: 800,
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 2,
    label: 'Detecting Patterns',
    icon: Brain,
    duration: 1200,
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 3,
    label: 'Analyzing Features',
    icon: Sparkles,
    duration: 800,
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 4,
    label: 'Calculating Confidence',
    icon: CheckCircle,
    duration: 200,
    color: 'from-green-500 to-emerald-500',
  },
];

export default function ProcessingAnimation({ onComplete }: ProcessingAnimationProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stageTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const runStage = (stageIndex: number) => {
      if (stageIndex >= stages.length) {
        setProgress(100);
        setTimeout(() => onComplete?.(), 300);
        return;
      }

      setCurrentStage(stageIndex);
      const stage = stages[stageIndex];
      const startProgress = (stageIndex / stages.length) * 100;
      const endProgress = ((stageIndex + 1) / stages.length) * 100;
      const progressIncrement = (endProgress - startProgress) / (stage.duration / 50);

      let currentProgress = startProgress;
      progressTimer = setInterval(() => {
        currentProgress += progressIncrement;
        if (currentProgress >= endProgress) {
          currentProgress = endProgress;
          clearInterval(progressTimer);
        }
        setProgress(Math.min(currentProgress, 100));
      }, 50);

      stageTimer = setTimeout(() => {
        runStage(stageIndex + 1);
      }, stage.duration);
    };

    runStage(0);

    return () => {
      clearTimeout(stageTimer);
      clearInterval(progressTimer);
    };
  }, [onComplete]);

  const currentStageData = stages[currentStage];
  const Icon = currentStageData?.icon || Brain;

  return (
    <div className="processing-animation-container">
      {/* Main Animation Card */}
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-2xl p-8 border-2 border-indigo-200 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* AI Brain Icon with Pulse */}
          <div className="flex justify-center mb-6">
            <div className={`relative bg-gradient-to-br ${currentStageData?.color} p-6 rounded-3xl shadow-xl animate-pulse-slow`}>
              <Icon className="text-white" size={48} strokeWidth={2} />
              
              {/* Scanning Lines Effect */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl">
                <div className="scan-line"></div>
              </div>

              {/* Particle Effects */}
              <div className="absolute inset-0">
                <div className="particle particle-1"></div>
                <div className="particle particle-2"></div>
                <div className="particle particle-3"></div>
              </div>
            </div>
          </div>

          {/* Current Stage Label */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800 mb-2 animate-fade-in">
              AI is Analyzing...
            </h3>
            <p className="text-lg text-indigo-600 font-semibold animate-slide-up">
              {currentStageData?.label}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold text-gray-600">Progress</span>
              <span className="text-lg font-bold text-indigo-600">{Math.round(progress)}%</span>
            </div>
            <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStageData?.color} rounded-full transition-all duration-300 ease-out`}
                style={{ width: `${progress}%` }}
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 shimmer"></div>
              </div>
            </div>
          </div>

          {/* Stage Indicators */}
          <div className="flex justify-between items-center">
            {stages.map((stage, index) => {
              const StageIcon = stage.icon;
              const isCompleted = index < currentStage;
              const isCurrent = index === currentStage;
              
              return (
                <div key={stage.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300
                      ${isCompleted ? `bg-gradient-to-br ${stage.color} scale-110` : ''}
                      ${isCurrent ? `bg-gradient-to-br ${stage.color} animate-bounce-subtle` : ''}
                      ${!isCompleted && !isCurrent ? 'bg-gray-200' : ''}
                    `}
                  >
                    <StageIcon
                      className={`
                        ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}
                      `}
                      size={20}
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="text-xs text-center text-gray-600 font-medium max-w-[80px] leading-tight">
                    {stage.label.split(' ')[0]}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fun Facts */}
      <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <Sparkles className="text-blue-600 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-sm text-blue-900 font-medium">
              <strong>Did you know?</strong> Our AI analyzes over 50 different features including color, texture, symmetry, and border characteristics to provide accurate results.
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes gradient {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes pulseSlow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scanLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        @keyframes bounceSubtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        @keyframes particleFloat {
          0% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx), var(--ty)) scale(1);
            opacity: 0;
          }
        }

        .animate-gradient {
          animation: gradient 3s linear infinite;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        .animate-fade-in {
          animation: fadeIn 500ms ease-out;
        }

        .animate-slide-up {
          animation: slideUp 500ms ease-out;
        }

        .animate-bounce-subtle {
          animation: bounceSubtle 1s ease-in-out infinite;
        }

        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.8), transparent);
          animation: scanLine 2s linear infinite;
        }

        .shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          animation: shimmer 2s infinite;
        }

        .particle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          animation: particleFloat 2s ease-out infinite;
        }

        .particle-1 {
          top: 20%;
          left: 20%;
          --tx: -20px;
          --ty: -30px;
          animation-delay: 0s;
        }

        .particle-2 {
          top: 60%;
          right: 20%;
          --tx: 25px;
          --ty: -25px;
          animation-delay: 0.7s;
        }

        .particle-3 {
          bottom: 20%;
          left: 50%;
          --tx: 15px;
          --ty: -35px;
          animation-delay: 1.4s;
        }
      `}</style>
    </div>
  );
}
