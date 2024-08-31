import axiosInstance from '@/axios/axiosConfig';
import useRefreshToken from '@/hooks/useRefreshToken';
import { useUserContext } from '@/lib/context/user/userContext';
import { useVerifyUserMutation } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { IUser } from '@/types';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const CurrentUser = () => {
  const { setIsUserAuthenticated } = useUserContext();
  const navigate = useNavigate();
  const { id } = useParams();
  const [user, setUser] = useState<IUser | null>(null);

  const userMutation = useVerifyUserMutation();

  useEffect(() => {
    if (user) {
      setUser(user);
      setIsUserAuthenticated(true);
    }
  }, [user]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchUser = async () => {
      try {
        const userjwt = sessionStorage.getItem('userjwt');
        if (!userjwt) {
          axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${userjwt}`;
        }
        const user = await userMutation.mutateAsync();
        signal;
        if (isMounted) {
          setUser(user);
          setIsUserAuthenticated(true);
        }
      } catch (error: Error | any) {
        if (error.response.status && error.response.status === 401) {
          console.error('Error verifying user:', error.response.data.message);
          try {
            const newAccessToken = await useRefreshToken();
            const response = await axiosInstance.get('/api/currentuser', {
              headers: {
                Authorization: `Bearer ${newAccessToken}`,
              },
              withCredentials: true,
              signal,
            });
            if (response.status === 200 && response.data.user) {
              sessionStorage.setItem('userjwt', JSON.stringify(newAccessToken));
              axiosInstance.defaults.headers.common['Authorization'] =
                `Bearer ${newAccessToken}`;
              fetchUser();
              setUser(response.data.user);
              setIsUserAuthenticated(true);
            }
          } catch (refreshError: any) {
            console.error('Error verifying user:', refreshError);
            navigate('/sign-in', { state: { from: location }, replace: true });
          }
        } else {
          console.error('Error verifying user:', error);
          setIsUserAuthenticated(false);
        }
      } finally {
        setIsUserAuthenticated(false);
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [id, setIsUserAuthenticated, navigate, user, userMutation]);

  return { user, setUser };
};
