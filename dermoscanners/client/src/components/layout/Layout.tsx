import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold">DermoScanners</Link>
          <nav className="flex items-center gap-4">
            <NavLink to="/" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>Dashboard</NavLink>
            <NavLink to="/scan" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>Scan</NavLink>
            <NavLink to="/recommendations" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>Recommendations</NavLink>
            <NavLink to="/compare" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>Compare</NavLink>
            <NavLink to="/profile" className={({ isActive }) => isActive ? 'text-blue-600 font-medium' : 'text-gray-600'}>Profile</NavLink>
            {user && (
              <button onClick={logout} className="ml-2 text-sm text-red-600 hover:text-red-700">Logout</button>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="py-6 text-center text-sm text-gray-500">© {new Date().getFullYear()} DermoScanners</footer>
    </div>
  );
}

