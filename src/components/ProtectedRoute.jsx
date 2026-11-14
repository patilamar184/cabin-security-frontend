import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sends the visitor to the sign-in page unless they hold the right kind of account.
export default function ProtectedRoute({ role }) {
  const auth = useAuth();
  if (!auth.token || auth.role !== role) return <Navigate to="/login" replace />;
  return <Outlet />;
}
