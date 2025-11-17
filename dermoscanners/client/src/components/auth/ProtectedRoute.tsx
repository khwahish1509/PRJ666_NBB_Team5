import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isHydrated } = useAuth();
  const location = useLocation();
  
  // Show nothing while checking authentication
  if (!isHydrated) {
    return null;
  }
  
  // Redirect to welcome page if not authenticated
  if (!user) {
    return <Navigate to="/welcome" state={{ from: location }} replace />;
  }
  
  return children;
}

