import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../axios/axiosConfig';

const useRefreshStatus = (follower_id: any, following_id: any) => {
  const [status, setStatus] = useState('unfollow');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<null | Error>(null);

  const refreshStatus = useCallback(async () => {
    setIsPending(true);
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/api/getfollowstatus', {
        params: {
          follower_id,
          following_id,
          status,
        },
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      setStatus(response.data.status || 'unfollow');
      setIsRefreshing(false);
      return response.data;
    } catch (error) {
      setError(null);
      console.error('Error refreshing status', error);
      setIsRefreshing(false);
      throw Error('Error refreshing status');
    } finally {
      setIsPending(false);
    }
  }, [follower_id, following_id, status]);

  useEffect(() => {
    if (follower_id && following_id) {
      refreshStatus();
    }
  }, [follower_id, following_id, refreshStatus]);

  return { status, isPending, isRefreshing, refreshStatus, error };
};
export default useRefreshStatus;
