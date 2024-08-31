import axiosInstance from '@/axios/axiosConfig';
import { IStory } from '@/types';

// ** Fetch user stories ** //
export const getUserStoryMutation = async (
  limit: string,
  offset: string
): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/userstories', {
      params: { limit, offset },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
};

// ** Wrapper function around updateUserStoryMutation ** //
export const updateUserStoryMutation = async (
  user_id: string,
  story: IStory
): Promise<any> => {
  try {
    const response = await axiosInstance.put('/api/updateUserStory', story, {
      params: { user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating user story:', error);
    throw error;
  }
};

// ** Wrapper function around getUserStoryMutation ** //
export const getSelfStoryMutation = async (user_id: string): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/userstory/:id', {
      params: { user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user stories:', error);
    throw error;
  }
};

export default {
  getUserStoryMutation,
  updateUserStoryMutation,
  getSelfStoryMutation,
};
