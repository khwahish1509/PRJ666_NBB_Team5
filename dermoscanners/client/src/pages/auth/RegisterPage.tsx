import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const skinTypes = ['dry', 'oily', 'combination', 'sensitive', 'normal'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skinType, setSkinType] = useState<string | undefined>(undefined);
  const [skinGoals, setSkinGoals] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function passwordStrong(pw: string) {
    return pw.length >= 8 && /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  }

  function nextStep() {
    if (step === 1 && (!name || !email)) return;
    if (step === 2 && !passwordStrong(password)) return;
    setStep((s) => s + 1);
  }

  function prevStep() {
    setStep((s) => s - 1);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ name, email, password, skinType, skinGoals });
      navigate('/', { replace: true });
    } catch (err: any) {
      const apiMessage = err?.response?.data?.message;
      const apiErrors = err?.response?.data?.errors;
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        setError(apiErrors[0]?.msg || 'Registration failed');
      } else if (apiMessage) {
        setError(apiMessage);
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>
      {error && <p className="text-red-600 mb-3">{error}</p>}
      <form className="space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Name</label>
              <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} minLength={2} maxLength={100} required />
            </div>
            <div>
              <label className="block text-sm mb-1">Email</label>
              <input type="email" className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex justify-between">
              <button type="button" className="bg-gray-200 text-gray-800 px-4 py-2 rounded" disabled>Back</button>
              <button type="button" onClick={nextStep} className="bg-blue-600 text-white px-4 py-2 rounded">Next</button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Password</label>
              <input type="password" className="w-full border rounded px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} required />
              <p className="text-xs text-gray-500 mt-1">8+ characters with upper, lower, number, special character.</p>
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Back</button>
              <button type="button" onClick={nextStep} disabled={!passwordStrong(password)} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">Next</button>
            </div>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm mb-1">Skin Type</label>
              <select className="w-full border rounded px-3 py-2" value={skinType || ''} onChange={(e) => setSkinType(e.target.value || undefined)}>
                <option value="">Select skin type (optional)</option>
                {skinTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Skincare Goals</label>
              <textarea className="w-full border rounded px-3 py-2" value={skinGoals} onChange={(e) => setSkinGoals(e.target.value)} minLength={10} required />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-gray-200 text-gray-800 px-4 py-2 rounded">Back</button>
              <button type="button" onClick={onSubmit} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded">{loading ? 'Creating...' : 'Create account'}</button>
            </div>
          </div>
        )}
      </form>
      <p className="text-sm mt-3">Already have an account? <Link to="/login" className="text-blue-600">Sign in</Link></p>
    </div>
  );
}

