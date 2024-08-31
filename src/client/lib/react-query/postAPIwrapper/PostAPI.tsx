import axiosInstance from '@/axios/axiosConfig';
import { INewPost, IUpdatePost } from '@/types';

export const getInfinitePostsMutation = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getInfinitePosts', {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const { posts, page: currentPage, totalPages } = response.data;
    return {
      posts: posts.rows,
      nextPage: currentPage + 1,
      totalPages,
    };
  } catch (error) {
    console.error('Error getting infinite posts:', error);
    throw error;
  }
};

// Wrapper function around createPostMutation that accepts post data
export const createPostMutation = async (post: INewPost): Promise<any> => {
  try {
    const userjwt = sessionStorage.getItem('userjwt');
    if (userjwt) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${userjwt}`;
    }
    const response = await axiosInstance.post('/api/createPost', post, {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
};

// ** Wrapper function around updatePostMutation
export const updatePostMutation = async (
  post_id: number,
  post: IUpdatePost
): Promise<any> => {
  try {
    const response = await axiosInstance.put('/api/updatePost', post, {
      params: { post_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
};

// ** Wrapper function around getAllPostsMutation ** //
export const getAllPostsMutation = async (): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getAllPosts', {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error('Error getting all posts:', error);
    throw error;
  }
};

// ** Wrapper function around get recent Posts with limit Mutation ** //
export const getRecentPostsMutation = async (
  page: number,
  limit: number
): Promise<any> => {
  try {
    const response = await axiosInstance.get('/api/getRecentPosts', {
      params: { page, limit },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    const { posts, page: currentPage, totalPages } = response.data;
    return {
      posts: posts.rows,
      nextPage: currentPage + 1,
      totalPages,
    };
  } catch (error) {
    console.error('Error getting recent posts:', error);
    throw error;
  }
};

// ** Wrapper function around savePostMutation ** //
export const savePostMutation = async (
  post_id: string,
  user_id: string
): Promise<any> => {
  try {
    const response = await axiosInstance.post(
      '/api/savePost',
      {
        post_id,
        user_id,
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
    console.error('Error saving post:', error);
    throw error;
  }
};

// ** Wrapper function around likePostMutation ** //
export const likePostMutation = async (
  post_id: string,
  likes_count: string
): Promise<any> => {
  try {
    const userjwt = sessionStorage.getItem('userjwt');
    if (userjwt) {
      axiosInstance.defaults.headers.common['Authorization'] =
        `Bearer ${userjwt}`;
    }
    const response = await axiosInstance.post(
      '/api/likePost',
      {
        post_id,
        likes_count,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      }
    );
    if (response.status === 200) {
      if (response.data.usertoken) {
        sessionStorage.setItem(
          'userjwt',
          JSON.stringify(response.data.usertoken)
        );
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.usertoken}`;
      }
    }
    return response.data;
  } catch (error) {
    console.error('Error liking post:', error);
    throw error;
  }
};

// ** Wrapper function around deletePostMutation
export const deletePostMutation = async (
  post_id: string,
  user_id: string
): Promise<any> => {
  try {
    const response = await axiosInstance.delete('/api/deletePost', {
      data: {
        post_id,
        user_id,
      },
    });
    if (response.status === 200) {
      if (response.data.usertoken) {
        sessionStorage.setItem(
          'userjwt',
          JSON.stringify(response.data.usertoken)
        );
        axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${response.data.usertoken}`;
      }
    }
    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
};

// ** Wrapper function around deleteLikePostMutation
export const deleteLikedPostMutation = async (
  post_id: string,
  user_id: string
): Promise<any> => {
  try {
    const response = await axiosInstance.delete('/api/deleteLikedPost', {
      data: { post_id: post_id, user_id: user_id },
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.log('Error deleting like:', error);
    throw error;
  }
};

export default {
  getInfinitePostsMutation,
  createPostMutation,
  updatePostMutation,
  getAllPostsMutation,
  getRecentPostsMutation,
  savePostMutation,
  likePostMutation,
  deletePostMutation,
  deleteLikedPostMutation,
};
