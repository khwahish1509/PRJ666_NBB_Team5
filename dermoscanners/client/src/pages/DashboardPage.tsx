import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Welcome, {user?.name}</h1>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Profile completion</p>
          <p className="text-xl font-semibold">{user?.skinType ? '80%' : '60%'} complete</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Products scanned</p>
          <p className="text-xl font-semibold">0</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-600">Recommendations</p>
          <p className="text-xl font-semibold">Coming soon</p>
        </div>
      </div>
    </div>
  );
}

