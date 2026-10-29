import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../config/constants';
import { useAuth } from '../../context/AuthContext';
import { Loading } from '../ui/Feedback';

/** Only lets logged-in users through; everyone else goes to the login page. */
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loading text="Checking your session..." />;
  if (!user) return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  return <Outlet />;
}
