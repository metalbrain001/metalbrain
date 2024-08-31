import axiosInstance from '@/axios/axiosConfig';
import { useUserContext } from '@/lib/context/user/userContext';

const useRefreshToken = async () => {
  const { setAuthUser } = useUserContext();
  const refreshToken = async () => {
    try {
      const response = await axiosInstance.post('/api/refreshusertoken', {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setAuthUser(prev => {
        console.log(JSON.stringify(prev));
        console.log(JSON.stringify(response.data.userrefreshtoken));
        return {
          ...prev,
          accessToken: response.data.userrefreshtoken,
        };
      });
      const newAccessToken = response.data.userrefreshtoken;
      sessionStorage.setItem('accessToken', JSON.stringify(newAccessToken));
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${newAccessToken}`;
      return newAccessToken;
    } catch (error: any) {
      console.error('Error in refreshing token', error);
      throw new Error('Error in refreshing token');
    }
  };
  return refreshToken;
};

export default useRefreshToken;
