import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, GitCompare, TrendingUp, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user?.name}!</h1>
      <p className="text-gray-600 mb-6">Your skincare safety companion</p>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <button
          onClick={() => navigate('/scan')}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition flex items-center gap-4 shadow-lg"
        >
          <Camera size={32} />
          <div className="text-left">
            <h3 className="text-lg font-semibold">Scan Product</h3>
            <p className="text-sm opacity-90">Scan barcode or enter manually</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/recommendations')}
          className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-6 rounded-xl hover:from-pink-700 hover:to-rose-700 transition flex items-center gap-4 shadow-lg"
        >
          <Sparkles size={32} />
          <div className="text-left">
            <h3 className="text-lg font-semibold">Recommendations</h3>
            <p className="text-sm opacity-90">Personalized products</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/compare')}
          className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-6 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center gap-4 shadow-lg"
        >
          <GitCompare size={32} />
          <div className="text-left">
            <h3 className="text-lg font-semibold">Compare Products</h3>
            <p className="text-sm opacity-90">Side-by-side comparison</p>
          </div>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Profile Completion</p>
          <p className="text-2xl font-bold text-indigo-600">{user?.skinType ? '80%' : '60%'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Products Scanned</p>
          <p className="text-2xl font-bold text-green-600">0</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Recommendations</p>
          <p className="text-2xl font-bold text-purple-600">Available</p>
        </div>
      </div>
    </div>
  );
}

