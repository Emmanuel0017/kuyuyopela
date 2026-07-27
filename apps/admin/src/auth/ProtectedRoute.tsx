import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ requiredRole }: { requiredRole?: 'SUPER_ADMIN' }) {
  const { admin, isLoading } = useAuth();

  if (isLoading) return null; // avoid flashing login screen during initial token check

  if (!admin) return <Navigate to="/login" replace />;
  if (requiredRole && admin.role !== requiredRole) return <Navigate to="/" replace />;

  return <Outlet />;
}