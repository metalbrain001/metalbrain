import { useUserContext } from '@/lib/context/user/userContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import instancePrivate from '../axios/axiosConfig';
import useRefreshToken from './useRefreshToken';

export const useAxiosPrivate = () => {
  const { user } = useUserContext();
  const refresh = useRefreshToken();
  const { setAuthUser } = useUserContext();
  const navigate = useNavigate();

  useEffect(() => {
    const requestInterceptor = instancePrivate.interceptors.request.use(
      config => {
        if (!config.headers['Authorization']) {
          const userjwt = JSON.parse(sessionStorage.getItem('userjwt') || '{}');
          config.headers.Authorization = `Bearer ${userjwt}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );
    const responseInterceptor = instancePrivate.interceptors.response.use(
      response => {
        return response;
      },
      async error => {
        const originalRequest = error.config;
        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest.sent
        ) {
          originalRequest._retry = true;
          try {
            const newAccessToken = await refresh;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return instancePrivate(originalRequest);
          } catch (refreshError: any) {
            console.error('Error in refreshing token', error);
            if (!user) {
              navigate('/sign-in');
            } else {
              throw new Error('Error in refreshing token');
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return () => {
      instancePrivate.interceptors.request.eject(requestInterceptor);
      instancePrivate.interceptors.response.eject(responseInterceptor);
    };
  }, [setAuthUser, user, refresh, navigate]);
  return instancePrivate;
};

export default useAxiosPrivate;
