import axiosInstance from '@/axios/axiosConfig';
import { INewUser } from '@/types';

// ** Check User Mutation ** //
export const checkUserMutation = async (): Promise<any> => {
  try {
    const userjwt = sessionStorage.getItem('userjwt');
    if (userjwt) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${userjwt}`;
    }
    const response = await axiosInstance.get('/api/verifyUser', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** Register User Mutation ** //
export const registerUserMutation = async (user: INewUser): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/registerUser', user);
    return response.data;
  } catch (error) {
    console.error('Error registering user: ', error);
  }
};

// ** Login User Mutation ** //
export const loginUserMutation = async (
  email: string,
  password: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      '/api/loginUser',
      JSON.stringify({ email, password }),
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      sessionStorage.setItem('userjwt', response.data.usertoken);
      sessionStorage.setItem('userrefreshjwt', response.data.userrefreshtoken);
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.usertoken}`;
    }
    return response.data;
  } catch (error: any) {
    console.error('Error logging in user: ', error);
  }
};

// ** Refresh User Token Mutation ** //
export const refreshUserTokenMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/refreshusertoken', {
      withCredentials: true,
    });
    if (response.status === 200) {
      sessionStorage.setItem('userjwt', response.data.usertoken);
      sessionStorage.setItem('userrefreshjwt', response.data.userrefreshtoken);
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${response.data.usertoken}`;
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** Logout User Mutation ** //
export const logoutUserMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/logoutUser', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    if (response.data.message === 'User logged out successfully') {
      sessionStorage.removeItem('userjwt');
      sessionStorage.removeItem('userrefreshjwt');
      delete axiosInstance.defaults.headers.common['Authorization'];

      document.cookie =
        'userjwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie =
        'userrefreshjwt =; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    } else {
      console.error('Error logging out admin:', response.data.message);
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error: any) {
    console.error(error);
  }
};

// ** Get currentUserMutation ** //
export const currentUserMutation = async (): Promise<any> => {
  try {
    const userjwt = sessionStorage.getItem('userjwt');
    if (userjwt) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${userjwt}`;
    }
    const response = await axiosInstance.get('/api/currentuser', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    if (response.status === 200) {
      const userrefreshtoken = sessionStorage.getItem('userrefreshtoken');
      if (userrefreshtoken) {
        sessionStorage.setItem('userrefreshtoken', userrefreshtoken);
      }
      return response.data;
    }
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** Get user by ID Mutation ** //
export const getUserByIdMutation = async (user_id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getUserbyId/:user_id', {
      params: { user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** Follow a user Mutation ** //
export const followUserMutation = async (
  follower_id: number,
  following_id: number,
  status: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      '/api/followUser',
      {
        follower_id,
        following_id,
        status,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** This section is for Following and Followers ** //
// ** Get Followers Mutation ** //
export const getFollowersMutation = async (user_id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getfollowers', {
      params: { user_id: user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// ** Follow User Mutation ** //
export const getFollowingMutation = async (user_id: number): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getfollowing', {
      params: { user_id: user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting following:', error);
    throw error;
  }
};

// ** Get Follow Status Mutation ** //
export const getFollowStatusMutation = async (
  follower_id: number,
  following_id: number,
  status: 'follow' | 'unfollow' | 'block' | 'self'
): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getfollowstatus', {
      params: { follower_id, following_id, status },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting follow status:', error);
    throw error;
  }
};

// ** Get All users Mutation with limit and offset ** //
export const getAllUsersMutation = async (
  limit: string,
  offset: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/allusers', {
      params: { limit, offset },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting all users:', error);
    throw error;
  }
};

export default {
  checkUserMutation,
  registerUserMutation,
  loginUserMutation,
  refreshUserTokenMutation,
  logoutUserMutation,
  currentUserMutation,
  getUserByIdMutation,
  getFollowersMutation,
  getFollowingMutation,
};
