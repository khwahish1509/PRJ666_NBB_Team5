import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Mail, ArrowLeft, Key } from 'lucide-react';

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setToken(null);
    setLoading(true);
    
    try {
      const response = await api.post('/auth/reset', { email });
      setMessage(response.data.message || 'If account exists, an email has been sent');
      if (response.data.token) {
        setToken(response.data.token);
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate('/login')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Login</span>
        </button>

        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <Key className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 gradient-text">Reset Password</h1>
          <p className="text-center text-gray-600 mb-8">
            Enter your email and we'll send you a reset link
          </p>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-scale-in">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {message && (
            <div className="bg-green-50 border-2 border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 animate-scale-in">
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {token && (
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-6 animate-scale-in">
              <p className="text-sm font-semibold text-yellow-800 mb-2">Reset Token (for testing):</p>
              <p className="text-xs font-mono bg-white p-3 rounded-lg break-all border border-yellow-200 mb-3">
                {token}
              </p>
              <Link
                to={`/reset-password/${token}`}
                className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-semibold"
              >
                <Key size={16} />
                <span>Reset Password Now →</span>
              </Link>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="email"
                  className="input-field pl-12"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm space-y-2">
            <Link
              to="/login"
              className="block text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
            >
              Back to Login
            </Link>
            <div className="flex items-center gap-2 justify-center">
              <span className="text-gray-600">Don't have an account?</span>
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
