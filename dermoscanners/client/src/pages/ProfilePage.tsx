import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { User, Droplets, Target, CheckCircle } from 'lucide-react';

const options = ['dry', 'oily', 'combination', 'sensitive', 'normal'];

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [skinType, setSkinType] = useState(user?.skinType || '');
  const [skinGoals, setSkinGoals] = useState(user?.skinGoals || '');
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(user?.name || '');
    setSkinType(user?.skinType || '');
    setSkinGoals(user?.skinGoals || '');
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/auth/profile', { name, skinType: skinType || undefined, skinGoals });
      setMessage('Profile updated successfully!');
      // Optionally refresh local storage auth with new user data
      const stored = localStorage.getItem('auth');
      if (stored) {
        const parsed = JSON.parse(stored);
        localStorage.setItem('auth', JSON.stringify({ ...parsed, user: res.data }));
      }
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-pink-50/30 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center header-fade-in">
          <div className="inline-block mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-4 rounded-2xl shadow-lg">
              <User className="text-white" size={32} />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
            Your Profile
          </h1>
          <p className="text-gray-600 text-lg">Personalize your skincare experience</p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 text-green-800 px-6 py-4 rounded-xl flex items-center gap-3 shadow-lg animate-slide-down">
            <CheckCircle className="flex-shrink-0" size={24} />
            <p className="font-semibold">{message}</p>
          </div>
        )}

        {/* Profile Form */}
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 space-y-6">
          {/* Name Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-1.5 rounded-lg">
                <User size={16} className="text-purple-600" />
              </div>
              Name
            </label>
            <input 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="Enter your name"
            />
          </div>

          {/* Skin Type Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 p-1.5 rounded-lg">
                <Droplets size={16} className="text-blue-600" />
              </div>
              Skin Type
            </label>
            <select 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium" 
              value={skinType} 
              onChange={(e) => setSkinType(e.target.value)}
            >
              <option value="">Select skin type</option>
              {options.map((o) => (
                <option key={o} value={o} className="capitalize">{o.charAt(0).toUpperCase() + o.slice(1)}</option>
              ))}
            </select>
            <p className="mt-2 text-xs text-gray-500">Help us recommend products suited for your skin</p>
          </div>

          {/* Skincare Goals Field */}
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">
              <div className="bg-gradient-to-br from-pink-100 to-rose-100 p-1.5 rounded-lg">
                <Target size={16} className="text-pink-600" />
              </div>
              Skincare Goals
            </label>
            <textarea 
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all font-medium resize-none" 
              value={skinGoals} 
              onChange={(e) => setSkinGoals(e.target.value)} 
              minLength={10} 
              required 
              rows={4}
              placeholder="Describe your skincare goals (e.g., reduce acne, anti-aging, hydration...)"
            />
            <p className="mt-2 text-xs text-gray-500">Minimum 10 characters</p>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Saving...
              </span>
            ) : (
              'Save Changes'
            )}
          </button>
        </form>

        {/* Profile Completion */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-800">Profile Completion</h3>
            <span className="text-2xl font-bold text-purple-600">
              {name && skinType && skinGoals ? '100%' : skinType ? '66%' : '33%'}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
              style={{ width: name && skinType && skinGoals ? '100%' : skinType ? '66%' : '33%' }}
            ></div>
          </div>
          <p className="mt-3 text-sm text-gray-600">
            {name && skinType && skinGoals 
              ? '🎉 Your profile is complete!' 
              : 'Complete your profile for better recommendations'}
          </p>
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

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .header-fade-in {
          animation: fadeIn 600ms ease-out;
        }

        .animate-slide-down {
          animation: slideDown 400ms ease-out;
        }
      `}</style>
    </div>
  );
}

