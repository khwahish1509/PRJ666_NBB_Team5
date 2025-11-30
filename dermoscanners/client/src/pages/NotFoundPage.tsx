import { useNavigate } from 'react-router-dom';
import { Home, Camera, Clock, AlertCircle } from 'lucide-react';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl p-6">
              <AlertCircle size={64} className="text-red-600" />
            </div>
          </div>

          <h1 className="text-7xl font-black mb-4 gradient-text">404</h1>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <button
              onClick={() => navigate('/')}
              className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-5 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
            >
              <Home size={24} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Home</span>
            </button>

            <button
              onClick={() => navigate('/scan')}
              className="group bg-gradient-to-r from-pink-600 to-rose-600 text-white p-5 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
            >
              <Camera size={24} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">Scan</span>
            </button>

            <button
              onClick={() => navigate('/history')}
              className="group bg-gradient-to-r from-green-600 to-teal-600 text-white p-5 rounded-xl hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 hover:scale-105"
            >
              <Clock size={24} className="group-hover:scale-110 transition-transform" />
              <span className="font-semibold">History</span>
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Need help? Contact support or return to the homepage.
          </p>
        </div>
      </div>
    </div>
  );
}
