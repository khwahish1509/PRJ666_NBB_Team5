import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Award, Flame, Target, Calendar, BarChart3, Zap, Trophy, ArrowLeftRight } from 'lucide-react';
import api from '../services/api';

interface ProgressData {
  totalScans: number;
  xp: number;
  level: number;
  nextMilestone: {
    scans: number;
    xp: number;
    title: string;
    badge: string;
  };
  riskTrend: Array<{
    date: string;
    risk: number;
    result: string;
    confidence: number;
  }>;
  improvementScore: number;
  achievements: Array<{
    scans: number;
    xp: number;
    title: string;
    badge: string;
  }>;
  stats: {
    averageRisk: number;
    improvementRate: number;
    consistencyStreak: number;
    last30DaysChange: number;
  };
}

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  lastScanDate: string | null;
  scanFrequency: number;
}

export default function ProgressPage() {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgressData();
  }, []);

  const fetchProgressData = async () => {
    try {
      const [progressRes, streakRes] = await Promise.all([
        api.get('/progress/analytics'),
        api.get('/progress/streak')
      ]);
      setProgress(progressRes.data.data);
      setStreak(streakRes.data.data);
    } catch (error) {
      console.error('Error fetching progress:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Unable to load progress data</p>
      </div>
    );
  }

  const xpToNextLevel = (progress.level * 100) - progress.xp;
  const xpProgress = ((progress.xp % 100) / 100) * 100;
  const scansToNextMilestone = progress.nextMilestone.scans - progress.totalScans;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          Your Progress Journey
        </h1>
        <p className="text-lg text-gray-600">Track your skin health improvement over time</p>
      </div>

      {/* Level & XP Card */}
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-10 h-10" />
              <div>
                <p className="text-sm opacity-90">Current Level</p>
                <h2 className="text-5xl font-bold">{progress.level}</h2>
              </div>
            </div>
            <p className="text-lg opacity-90">{progress.xp} XP Total</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Next Level</p>
            <p className="text-2xl font-bold">{xpToNextLevel} XP</p>
          </div>
        </div>
        
        {/* XP Progress Bar */}
        <div className="bg-white/20 rounded-full h-4 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${xpProgress}%` }}
          />
        </div>
        <p className="text-sm mt-2 opacity-90">{xpProgress.toFixed(0)}% to Level {progress.level + 1}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Scans */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-3xl font-bold text-blue-600">{progress.totalScans}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Total Scans</h3>
          <p className="text-sm text-gray-500 mt-1">
            {scansToNextMilestone} more to unlock "{progress.nextMilestone.title}"
          </p>
        </div>

        {/* Improvement Score */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-green-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-3xl font-bold text-green-600">{progress.improvementScore}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Improvement Score</h3>
          <p className="text-sm text-gray-500 mt-1">
            {progress.improvementScore >= 50 ? 'Improving!' : 'Keep tracking'}
          </p>
        </div>

        {/* Current Streak */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-orange-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-xl">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-3xl font-bold text-orange-600">{streak?.currentStreak || 0}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Current Streak</h3>
          <p className="text-sm text-gray-500 mt-1">
            Longest: {streak?.longestStreak || 0} scans
          </p>
        </div>

        {/* Scan Frequency */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-3xl font-bold text-purple-600">{streak?.scanFrequency.toFixed(1) || 0}</span>
          </div>
          <h3 className="font-semibold text-gray-800">Scans/Week</h3>
          <p className="text-sm text-gray-500 mt-1">Your tracking frequency</p>
        </div>
      </div>

      {/* Risk Trend Chart */}
      {progress.riskTrend.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-xl">
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Risk Trend Over Time</h2>
              <p className="text-gray-600">Lower is better</p>
            </div>
          </div>
          
          <div className="h-64">
            <RiskTrendChart data={progress.riskTrend} />
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-yellow-100 p-3 rounded-xl">
            <Award className="w-6 h-6 text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Achievements</h2>
            <p className="text-gray-600">{progress.achievements.length} unlocked</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {progress.achievements.map((achievement, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-xl p-4 text-center hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{achievement.badge}</div>
              <h3 className="font-bold text-gray-900 text-sm">{achievement.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{achievement.scans} scans</p>
              <p className="text-xs text-yellow-600 font-semibold">+{achievement.xp} XP</p>
            </div>
          ))}
          
          {/* Next Achievement */}
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center opacity-50">
            <div className="text-4xl mb-2">{progress.nextMilestone.badge}</div>
            <h3 className="font-bold text-gray-700 text-sm">{progress.nextMilestone.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{progress.nextMilestone.scans} scans</p>
            <p className="text-xs text-gray-500">Locked</p>
          </div>
        </div>
      </div>

      {/* Before/After Comparison CTA */}
      {progress.totalScans >= 2 && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Compare Your Progress</h2>
              <p className="text-white/90">See your skin health improvement with before & after comparison</p>
            </div>
            <button
              onClick={() => navigate('/compare-scans')}
              className="bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold hover:bg-indigo-50 transition-all flex items-center gap-3"
            >
              <ArrowLeftRight className="w-5 h-5" />
              <span>Compare Scans</span>
            </button>
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-100 p-3 rounded-xl">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Insights</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Average Risk Score</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">{progress.stats.averageRisk.toFixed(1)}</p>
            <p className="text-sm text-gray-600">
              {progress.stats.averageRisk < 3 ? 'Excellent! Keep it up!' : 
               progress.stats.averageRisk < 5 ? 'Good progress' : 
               'Consider consulting a dermatologist'}
            </p>
          </div>

          <div className="bg-white rounded-xl p-6">
            <h3 className="font-semibold text-gray-900 mb-2">30-Day Change</h3>
            <p className={`text-3xl font-bold mb-2 ${
              progress.stats.last30DaysChange < 0 ? 'text-green-600' :
              progress.stats.last30DaysChange > 0 ? 'text-red-600' :
              'text-gray-600'
            }`}>
              {progress.stats.last30DaysChange > 0 ? '+' : ''}{progress.stats.last30DaysChange}
            </p>
            <p className="text-sm text-gray-600">
              {progress.stats.last30DaysChange < 0 ? 'Risk decreased - Great job!' :
               progress.stats.last30DaysChange > 0 ? 'Risk increased - Stay vigilant' :
               'Risk stable'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple chart component
function RiskTrendChart({ data }: { data: Array<{ date: string; risk: number; result: string }> }) {
  const chartData = {
    labels: data.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: 'Risk Score',
        data: data.map(d => d.risk),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="relative h-full">
      <svg viewBox="0 0 800 200" className="w-full h-full">
        {/* Grid lines */}
        {[0, 2.5, 5, 7.5, 10].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={200 - (y * 20)}
            x2="800"
            y2={200 - (y * 20)}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        ))}
        
        {/* Line chart */}
        <polyline
          points={data.map((d, i) => 
            `${(i / (data.length - 1)) * 800},${200 - (d.risk * 20)}`
          ).join(' ')}
          fill="none"
          stroke="rgb(99, 102, 241)"
          strokeWidth="3"
        />
        
        {/* Data points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={(i / (data.length - 1)) * 800}
            cy={200 - (d.risk * 20)}
            r="5"
            fill={d.result === 'benign' ? '#10b981' : d.result === 'suspicious' ? '#f59e0b' : '#ef4444'}
            stroke="white"
            strokeWidth="2"
          />
        ))}
      </svg>
      
      {/* Legend */}
      <div className="flex justify-center gap-4 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>Benign</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <span>Suspicious</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>Malignant</span>
        </div>
      </div>
    </div>
  );
}
