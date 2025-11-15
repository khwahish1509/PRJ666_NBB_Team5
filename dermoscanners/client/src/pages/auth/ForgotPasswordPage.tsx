import { FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

export default function ForgotPasswordPage() {
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
      // Display token for testing (since email is not configured)
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
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Reset Password</h1>
      <p className="text-gray-600 mb-4">Enter your email address and we'll send you a password reset link.</p>
      
      {error && <p className="text-red-600 mb-3">{error}</p>}
      {message && <p className="text-green-600 mb-3">{message}</p>}
      
      {token && (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-3 mb-4">
          <p className="text-sm font-semibold mb-2">Reset Token (for testing):</p>
          <p className="text-xs font-mono bg-white p-2 rounded break-all">{token}</p>
          <p className="text-xs text-gray-600 mt-2">
            Use this link: <Link to={`/reset-password/${token}`} className="text-blue-600 underline">
              Reset Password
            </Link>
          </p>
        </div>
      )}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input 
            type="email" 
            className="w-full border rounded px-3 py-2" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div className="text-sm mt-3 space-y-1">
        <p><Link to="/login" className="text-blue-600">Back to Login</Link></p>
        <p>No account? <Link to="/register" className="text-blue-600">Register</Link></p>
      </div>
    </div>
  );
}
