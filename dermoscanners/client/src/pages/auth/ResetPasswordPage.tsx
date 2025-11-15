import { FormEvent, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { api } from '../../services/api';

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      await api.put(`/auth/reset/${token}`, { password });
      alert('Password has been reset successfully! Please login with your new password.');
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Set New Password</h1>
      <p className="text-gray-600 mb-4">Enter your new password below.</p>
      
      {error && <p className="text-red-600 mb-3">{error}</p>}
      
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">New Password</label>
          <input 
            type="password" 
            className="w-full border rounded px-3 py-2" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            minLength={8}
          />
          <p className="text-xs text-gray-500 mt-1">
            Must be 8+ characters with uppercase, lowercase, number, and special character
          </p>
        </div>
        <div>
          <label className="block text-sm mb-1">Confirm Password</label>
          <input 
            type="password" 
            className="w-full border rounded px-3 py-2" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
            minLength={8}
          />
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded">
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      
      <div className="text-sm mt-3">
        <p><Link to="/login" className="text-blue-600">Back to Login</Link></p>
      </div>
    </div>
  );
}
