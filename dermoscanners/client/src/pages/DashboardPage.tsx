import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Camera, GitCompare, TrendingUp, Sparkles, Trash2, Clock } from 'lucide-react';
import axios from 'axios';

interface ScanHistoryItem {
  _id: string;
  productId: {
    _id: string;
    name: string;
    brand: string;
    imageUrl?: string;
  };
  productSnapshot: {
    name: string;
    brand: string;
    price: number;
    rating: number;
  };
  scannedAt: string;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    fetchScanHistory();
  }, []);

  const fetchScanHistory = async () => {
    try {
      setHistoryLoading(true);
      const token = localStorage.getItem('auth');
      if (token) {
        const { tokens } = JSON.parse(token);
        const response = await axios.get('http://localhost:5001/api/history', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` }
        });
        setScanHistory(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching scan history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const deleteHistoryItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item from history?')) return;
    
    try {
      const token = localStorage.getItem('auth');
      if (token) {
        const { tokens } = JSON.parse(token);
        await axios.delete(`http://localhost:5001/api/history/${id}`, {
          headers: { Authorization: `Bearer ${tokens.accessToken}` }
        });
        setScanHistory(scanHistory.filter(item => item._id !== id));
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
      alert('Failed to delete history item');
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all scan history?')) return;
    
    try {
      const token = localStorage.getItem('auth');
      if (token) {
        const { tokens } = JSON.parse(token);
        await axios.delete('http://localhost:5001/api/history', {
          headers: { Authorization: `Bearer ${tokens.accessToken}` }
        });
        setScanHistory([]);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
      alert('Failed to clear history');
    }
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Profile Completion</p>
          <p className="text-2xl font-bold text-indigo-600">{user?.skinType ? '80%' : '60%'}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Products Scanned</p>
          <p className="text-2xl font-bold text-green-600">{scanHistory.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <p className="text-gray-600 text-sm mb-2">Recommendations</p>
          <p className="text-2xl font-bold text-purple-600">Available</p>
        </div>
      </div>

      {/* Scan History Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-gray-600" />
            <h2 className="text-xl font-bold text-gray-800">Recent Scans</h2>
          </div>
          {scanHistory.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        {historyLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading history...</p>
          </div>
        ) : scanHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No scan history yet. Start by scanning a product!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scanHistory.slice(0, 5).map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div
                  onClick={() => navigate(`/product/${item.productId._id}`)}
                  className="flex-1 cursor-pointer"
                >
                  <h3 className="font-semibold text-gray-800">
                    {item.productSnapshot.name || item.productId.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {item.productSnapshot.brand || item.productId.brand}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(item.scannedAt).toLocaleDateString()} at{' '}
                    {new Date(item.scannedAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteHistoryItem(item._id)}
                  className="ml-4 p-2 text-gray-400 hover:text-red-600 transition"
                  title="Delete from history"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            {scanHistory.length > 5 && (
              <p className="text-center text-sm text-gray-500 pt-2">
                Showing 5 of {scanHistory.length} scans
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

