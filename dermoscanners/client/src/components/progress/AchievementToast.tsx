import { useEffect, useState } from 'react';
import { Award, X } from 'lucide-react';

interface Achievement {
  badge: string;
  title: string;
  xp: number;
}

interface AchievementToastProps {
  achievement: Achievement | null;
  onClose: () => void;
}

export default function AchievementToast({ achievement, onClose }: AchievementToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-20 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white rounded-2xl shadow-2xl p-6 max-w-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="font-bold text-lg">Achievement Unlocked!</p>
              <p className="text-sm text-white/90">You're making great progress</p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onClose, 300);
            }}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-4">
          <div className="text-5xl">{achievement.badge}</div>
          <div>
            <p className="font-bold text-xl mb-1">{achievement.title}</p>
            <p className="text-sm text-white/90">+{achievement.xp} XP Earned</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/80">
          <span>✨</span>
          <span>Keep scanning to unlock more achievements!</span>
          <span>✨</span>
        </div>
      </div>
    </div>
  );
}
