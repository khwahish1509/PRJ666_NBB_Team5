import { FormEvent, useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const options = ['dry', 'oily', 'combination', 'sensitive', 'normal'];

export default function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [skinType, setSkinType] = useState(user?.skinType || '');
  const [skinGoals, setSkinGoals] = useState(user?.skinGoals || '');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    setName(user?.name || '');
    setSkinType(user?.skinType || '');
    setSkinGoals(user?.skinGoals || '');
  }, [user]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await api.put('/auth/profile', { name, skinType: skinType || undefined, skinGoals });
    setMessage('Profile updated');
    // Optionally refresh local storage auth with new user data
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      localStorage.setItem('auth', JSON.stringify({ ...parsed, user: res.data }));
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-semibold mb-4">Your Profile</h1>
      {message && <p className="text-green-600 mb-3">{message}</p>}
      <form onSubmit={onSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm mb-1">Skin Type</label>
          <select className="w-full border rounded px-3 py-2" value={skinType} onChange={(e) => setSkinType(e.target.value)}>
            <option value="">Select skin type</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Skincare Goals</label>
          <textarea className="w-full border rounded px-3 py-2" value={skinGoals} onChange={(e) => setSkinGoals(e.target.value)} minLength={10} required />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Save changes</button>
      </form>
    </div>
  );
}

