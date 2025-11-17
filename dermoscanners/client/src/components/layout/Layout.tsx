import { Link, NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Home, Scan, History, Sparkles, GitCompare, User, LogOut } from 'lucide-react';

export default function Layout() {
  const { user, logout } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Modern Header with Gradient */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  DermoScanners
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Your Skin Health Companion</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-2">
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <Home size={18} />
                <span>Dashboard</span>
              </NavLink>
              
              <NavLink 
                to="/scan" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <Scan size={18} />
                <span>Scan</span>
              </NavLink>
              
              <NavLink 
                to="/history" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <History size={18} />
                <span>History</span>
              </NavLink>
              
              <NavLink 
                to="/features" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <Sparkles size={18} />
                <span>Features</span>
              </NavLink>
              
              <NavLink 
                to="/recommendations" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <Sparkles size={18} />
                <span>Products</span>
              </NavLink>
              
              <NavLink 
                to="/compare" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <GitCompare size={18} />
                <span>Compare</span>
              </NavLink>
            </nav>

            {/* User Menu */}
            <div className="flex items-center gap-3">
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-700 hover:bg-white hover:shadow-md'
                  }
                `}
              >
                <User size={18} />
                <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
              </NavLink>
              
              {user && (
                <button 
                  onClick={logout} 
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:shadow-md transition-all duration-300"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <Outlet />
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/60 backdrop-blur-md border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 p-1.5 rounded-lg">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm text-gray-600 font-medium">
                © {new Date().getFullYear()} DermoScanners. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-indigo-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-indigo-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-indigo-600 transition">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

