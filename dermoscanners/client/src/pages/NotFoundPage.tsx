import { useNavigate } from 'react-router-dom';
import { Home, Camera, Clock, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 rounded-full p-6">
              <AlertCircle size={64} className="text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          {/* Navigation Links */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 rounded-xl hover:from-indigo-700 hover:to-purple-700 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <Home size={24} />
              <span className="font-semibold">Home</span>
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="bg-gradient-to-r from-pink-600 to-rose-600 text-white p-4 rounded-xl hover:from-pink-700 hover:to-rose-700 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <Camera size={24} />
              <span className="font-semibold">Scan</span>
            </button>

            <button
              onClick={() => navigate('/history')}
              className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-4 rounded-xl hover:from-green-700 hover:to-teal-700 transition flex items-center justify-center gap-3 shadow-lg"
            >
              <Clock size={24} />
              <span className="font-semibold">History</span>
            </button>
          </div>

          {/* Additional Help Text */}
          <p className="text-sm text-gray-500">
            Need help? Contact support or return to the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
