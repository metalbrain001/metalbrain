import { useUserContext } from '@/lib/context/user/userContext';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AuthUserLayout = () => {
  const { isUserAuthenticated } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isUserAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isUserAuthenticated, navigate]);

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img
        src="/assets/images/logo.jpg"
        alt="Auth User"
        className="hidden md:block w-3/5 max-h-screen object-cover object-center bg-no-repeat transform scale-90"
      />
    </>
  );
};

export default AuthUserLayout;
