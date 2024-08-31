import axiosInstance from '@/axios/axiosConfig';
import { useUserContext } from '@/lib/context/user/userContext';
import { INewUser } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  checkUserMutation,
  currentUserMutation,
  followUserMutation,
  getAllUsersMutation,
  getFollowersMutation,
  getFollowingMutation,
  getFollowStatusMutation,
  getUserByIdMutation,
  loginUserMutation,
  logoutUserMutation,
  refreshUserTokenMutation,
  registerUserMutation,
} from '../userAPIwrapper/UserAPI';
import { UserQueryKeys } from '../userQueryKeys/userQueryKeys';

// ** Verify User Mutation ** //
export const useVerifyUserMutation = () => {
  return useMutation({
    mutationFn: () => checkUserMutation(),
  });
};

// ** Register User Mutation ** //
export const useRegisterUserMutation = () => {
  return useMutation({
    mutationFn: (user: INewUser) => registerUserMutation(user),
  });
};

// ** Login User Mutation ** //
export const useLoginUserMutation = () => {
  return useMutation({
    mutationFn: (user: { email: string; password: string }) =>
      loginUserMutation(user.email, user.password),
  });
};

// ** Refresh User Token Mutation ** //
export const useRefreshUserTokenMutation = () => {
  return useMutation({
    mutationFn: () => refreshUserTokenMutation(),
  });
};

// ** Logout User Mutation ** //
export const useLogoutUserMutation = () => {
  const { setUser, setIsUserAuthenticated } = useUserContext();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: () => logoutUserMutation(),
    onSuccess: () => {
      setUser(null);
      setIsUserAuthenticated(false);
      document.cookie =
        'userjwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      sessionStorage.removeItem('userjwt');
      sessionStorage.removeItem('userrefreshjwt');
      delete axiosInstance.defaults.headers.common['Authorization'];
      navigate('/sign-in');
    },
  });
};

// ** current User Mutation ** //
export const useCurrentUserMutation = () => {
  return useQuery({
    queryKey: [UserQueryKeys.GET_CURRENT_USER],
    queryFn: () => currentUserMutation(),
  });
};

// ** get user by id Mutation ** //
export const useGetUserByIdMutation = ({ user_id }: { user_id: string }) => {
  return useQuery({
    queryKey: [UserQueryKeys.GET_USER_BY_ID],
    queryFn: () => getUserByIdMutation(user_id),
  });
};

// ** This wraps the Following user ** //
export const useFollowUserMutation = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      follower_id,
      following_id,
      status,
    }: {
      follower_id: number;
      following_id: number;
      status: 'follow' | 'unfollow' | 'pending' | 'blocked';
    }) => followUserMutation(follower_id, following_id, status),
    onSuccess: (data: any) => {
      QueryClient.invalidateQueries({
        queryKey: [UserQueryKeys.GET_USER_FOLLOWERS, data?.id],
      });
    },
  });
};

// ** This wraps the Follow and following users ** //
export const useGetUserFollowers = ({ user_id }: { user_id: number }) => {
  return useQuery({
    queryKey: [UserQueryKeys.GET_USER_FOLLOWERS, user_id],
    queryFn: () => getFollowersMutation(user_id),
    enabled: !!user_id,
  });
};

// ** Wrapper function around useGetUserFollowing ** //
export const useGetUserFollowing = ({ user_id }: { user_id: number }) => {
  return useQuery({
    queryKey: [UserQueryKeys.GET_USER_FOLLOWERS, user_id],
    queryFn: () => getFollowingMutation(user_id),
    enabled: !!user_id,
  });
};

// ** This wrap the get Follow Status ** //
export const useGetFollowStatus = ({
  follower_id,
  following_id,
  status,
}: {
  follower_id: number;
  following_id: number;
  status: 'follow' | 'unfollow' | 'block' | 'self';
}) => {
  return useQuery({
    queryKey: [UserQueryKeys.FOLLOW_STATUS, follower_id, following_id, status],
    queryFn: () => getFollowStatusMutation(follower_id, following_id, status),
    enabled: !!follower_id && !!following_id && !!status,
  });
};

// ** This wraps the Get all user with limit and offset ** //
export const useGetAllUsers = ({
  limit,
  offset,
}: {
  limit: string;
  offset: string;
}) => {
  return useQuery({
    queryKey: [UserQueryKeys.GET_ALL_USERS, limit, offset],
    queryFn: () => getAllUsersMutation(limit, offset),
    enabled: !!limit && !!offset,
  });
};

export default {
  useVerifyUserMutation,
  useRegisterUserMutation,
  useLoginUserMutation,
  useRefreshUserTokenMutation,
  useLogoutUserMutation,
  useCurrentUserMutation,
  useGetUserByIdMutation,
  useGetUserFollowers,
  useGetUserFollowing,
};
