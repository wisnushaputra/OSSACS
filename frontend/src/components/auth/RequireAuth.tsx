import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';

const RequireAuth = () => {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    // Redirect them to the /login page, but save the current location they were
    // trying to go to so they can be redirected there after they login.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RequireAuth;