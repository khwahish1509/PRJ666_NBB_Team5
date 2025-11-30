import { FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, User, Mail, Lock, Target, ArrowLeft, ArrowRight, Check } from 'lucide-react';

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
      navigate('/dashboard', { replace: true });
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

  const passwordChecks = [
    { label: '8+ characters', valid: password.length >= 8 },
    { label: 'Uppercase letter', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase letter', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special character', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>

        {/* Register Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-4 rounded-2xl shadow-lg">
              <UserPlus className="text-white" size={32} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2 gradient-text">Create Account</h1>
          <p className="text-center text-gray-600 mb-8">Join DermoScanners today</p>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? 'w-12 bg-gradient-to-r from-indigo-600 to-purple-600' : 
                  s < step ? 'w-8 bg-green-500' : 'w-8 bg-gray-300'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 animate-scale-in">
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          <form className="space-y-5">
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      className="input-field pl-12"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      minLength={2}
                      maxLength={100}
                      required
                    />
                  </div>
                </div>
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
                  type="button"
                  onClick={nextStep}
                  disabled={!name || !email}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <span>Next</span>
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="password"
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mt-3 space-y-2">
                    {passwordChecks.map((check, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          check.valid ? 'bg-green-500' : 'bg-gray-300'
                        }`}>
                          {check.valid && <Check size={12} className="text-white" />}
                        </div>
                        <span className={check.valid ? 'text-green-700' : 'text-gray-600'}>
                          {check.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!passwordStrong(password)}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <span>Next</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5 animate-fade-in">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skin Type (Optional)</label>
                  <select
                    className="input-field"
                    value={skinType || ''}
                    onChange={(e) => setSkinType(e.target.value || undefined)}
                  >
                    <option value="">Select your skin type</option>
                    {skinTypes.map((t) => (
                      <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Skincare Goals</label>
                  <div className="relative">
                    <Target className="absolute left-4 top-4 text-gray-400" size={20} />
                    <textarea
                      className="input-field pl-12 min-h-[120px]"
                      placeholder="What are your skincare goals? (e.g., reduce acne, anti-aging, hydration)"
                      value={skinGoals}
                      onChange={(e) => setSkinGoals(e.target.value)}
                      minLength={10}
                      required
                    />
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={20} />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading || skinGoals.length < 10}
                    className="btn-primary flex-1"
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </button>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 text-center text-sm">
            <div className="flex items-center gap-2 justify-center">
              <span className="text-gray-600">Already have an account?</span>
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

