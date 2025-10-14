import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isHydrated } = useAuth();
  const location = useLocation();
  if (!isHydrated) {
    return null;
  }
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}

