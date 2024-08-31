import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/lib/context/user/userContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const RequireAuthentication = () => {
  const { isUserAuthenticated, setIsUserLoading } = useUserContext();
  const location = useLocation();

  if (!setIsUserLoading) {
    return <Loader />;
  }

  if (!isUserAuthenticated) {
    return (
      <Navigate to="/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  return <Outlet />;
};

export default RequireAuthentication;
