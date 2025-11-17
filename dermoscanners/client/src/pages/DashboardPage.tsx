import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, GitCompare, TrendingUp, Sparkles, Trash2, Clock } from 'lucide-react';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface ScanHistoryItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    brand: string;
  };
  productSnapshot: {
    name: string;
    brand: string;
  };
  scannedAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const { data } = await api.get('/history');
      setScanHistory(data.data || []);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this scan?')) return;
    try {
      await api.delete(`/history/${id}`);
      setScanHistory(prev => prev.filter(item => item._id !== id));
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const clearAll = async () => {
    if (!confirm('Clear all history?')) return;
    try {
      await api.delete('/history');
      setScanHistory([]);
    } catch (error) {
      alert('Failed to clear history');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Your skincare safety companion is ready to help
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              ✨ AI-Powered Analysis
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              🛡️ Safety First
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
              📊 Smart Recommendations
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="text-indigo-600" size={28} />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => navigate('/scan')}
            className="group bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-indigo-300 hover:scale-105"
          >
            <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Camera className="text-indigo-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Scan Product</h3>
            <p className="text-gray-600">Scan barcode or enter manually</p>
          </button>

          <button
            onClick={() => navigate('/recommendations')}
            className="group bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-pink-300 hover:scale-105"
          >
            <div className="bg-gradient-to-br from-pink-100 to-rose-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="text-pink-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Recommendations</h3>
            <p className="text-gray-600">Personalized products</p>
          </button>

          <button
            onClick={() => navigate('/compare')}
            className="group bg-white p-8 rounded-2xl hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-300 hover:scale-105"
          >
            <div className="bg-gradient-to-br from-green-100 to-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GitCompare className="text-green-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Compare Products</h3>
            <p className="text-gray-600">Side-by-side comparison</p>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Stats</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border-2 border-indigo-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 font-semibold">Profile Completion</p>
              <div className="bg-indigo-100 p-2 rounded-lg">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
            <p className="text-4xl font-bold text-indigo-600 mb-2">{user?.skinType ? '80%' : '60%'}</p>
            <div className="w-full bg-indigo-200 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full" style={{ width: user?.skinType ? '80%' : '60%' }}></div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 font-semibold">Products Scanned</p>
              <div className="bg-green-100 p-2 rounded-lg">
                <Camera className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{scanHistory.length}</p>
            <p className="text-sm text-gray-600">Total scans this month</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-700 font-semibold">Recommendations</p>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Sparkles className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-4xl font-bold text-purple-600 mb-2">10+</p>
            <p className="text-sm text-gray-600">Products available</p>
          </div>
        </div>
      </div>

      {/* Scan History Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 p-3 rounded-xl">
              <Clock size={24} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Recent Scans</h2>
              <p className="text-sm text-gray-500">Your scanning history</p>
            </div>
          </div>
          {scanHistory.length > 0 && (
            <button
              onClick={clearAll}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-xl font-medium transition-all"
            >
              <Trash2 size={16} />
              Clear All
            </button>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Loading history..." />
        ) : scanHistory.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Scans Yet</h3>
            <p className="text-gray-500 mb-6">Start scanning to see your history</p>
            <button
              onClick={() => navigate('/scan')}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Start Scanning
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-5 border-2 border-gray-100 rounded-xl hover:border-indigo-200 hover:shadow-lg transition-all group cursor-pointer"
                onClick={() => navigate(`/product/${item.productId._id}`)}
              >
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">
                    {item.productSnapshot.name || item.productId.name}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.productSnapshot.brand || item.productId.brand}
                  </p>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block mt-2">
                    {new Date(item.scannedAt).toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteItem(item._id);
                  }}
                  className="p-3 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {scanHistory.length > 5 && (
              <button
                onClick={() => navigate('/history')}
                className="w-full text-center py-3 text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                View All {scanHistory.length} Scans →
              </button>
            )}
          </div>
        )}
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

        .animate-fade-in {
          animation: fadeIn 600ms ease-out;
        }

        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

