import axiosInstance from '@/axios/axiosConfig';

// Wrapper function around to upload image and attach user and post id
export const uploadImageMutation = async (formData: FormData): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/uploadImage', formData, {
      headers: {
        'Custom-Header': 'image',
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Wrapper function around getPreviewImageUrlMutation
export const getPreviewImageUrlMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/sendImageUrl', {
      headers: {
        'Custom-Header': 'image',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error getting image preview:', error);
    throw error;
  }
};

// Wrapper function around uploadProfilePicMutation
export const uploadProfilePicMutation = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      '/api/uploadProfilePic',
      formData,
      {
        headers: {
          'Custom-Header': 'image',
          'Content-Type': 'multipart/form-data',
        },
        method: 'POST',
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// ** Wrapper function around getProfilePicPreviewUrlMutation
export const getProfilePicPreviewUrlMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/sendProfilePicUrl', {
      headers: {
        'Custom-Header': 'image',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting profile pic preview:', error);
    throw error;
  }
};

// ** Wrapper function around uploadUserStoryMutation ** //
export const uploadUserStoryMutation = async (
  formData: FormData
): Promise<any> => {
  try {
    const response = await axiosInstance.post('/api/uploadStory', formData, {
      headers: {
        'Custom-Header': 'image',
        'Content-Type': 'multipart/form-data',
      },
      method: 'POST',
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading user story:', error);
    throw error;
  }
};

// ** Wrapper function around getUserStoryPreviewUrlMutation ** //
export const getUserStoryPreviewUrlMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/sendStoryUrl', {
      headers: {
        'Custom-Header': 'image',
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting user story preview:', error);
    throw error;
  }
};

export default {
  uploadImageMutation,
  getPreviewImageUrlMutation,
  uploadProfilePicMutation,
  getProfilePicPreviewUrlMutation,
  uploadUserStoryMutation,
  getUserStoryPreviewUrlMutation,
};
