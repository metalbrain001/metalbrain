import { INewPost, IUpdatePost } from '@/types';
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import {
  createPostMutation,
  deleteLikedPostMutation,
  deletePostMutation,
  getAllPostsMutation,
  getInfinitePostsMutation,
  getRecentPostsMutation,
  likePostMutation,
  savePostMutation,
  updatePostMutation,
} from '../postAPIwrapper/PostAPI';
import { PostQueryKeys } from '../postQueryKeys/postQueryKey';

// ** Wrapper function around getInfinitePostsMutation ** //
export const useInfinitePosts = ({ pageParam }: { pageParam: number }) => {
  const lastId = useQueryClient().getQueryData([
    PostQueryKeys.GET_INFITE_POSTS,
    pageParam - 1,
  ]);
  // use lastId to get the last post id
  if (lastId) {
    console.log(lastId);
  }
  return useInfiniteQuery({
    queryKey: [PostQueryKeys.GET_INFITE_POSTS, pageParam],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getInfinitePostsMutation(pageParam, 10),
    getNextPageParam: (lastPage: any) => {
      const { nextPage, totalPages } = lastPage;
      if (nextPage <= totalPages) {
        return nextPage <= totalPages ? nextPage : undefined;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });
};

// ** Wrapper function around createPostMutation that accepts post data ** //
export const useCreatePost = () => {
  return useMutation({
    mutationFn: (post: INewPost) => createPostMutation(post),
  });
};

// ** Wrapper function around updatePostMutation ** //
export const useUpdatePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, post }: { post_id: number; post: IUpdatePost }) =>
      updatePostMutation(post_id, post),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_POST_BY_ID, data?.id],
      });
    },
  });
};

// ** Wrapper function around getAllPostsMutation ** //
export const useGetAllPosts = () => {
  return useQuery({
    queryKey: [PostQueryKeys.GET_ALL_POSTS],
    queryFn: getAllPostsMutation,
  });
};

export const useSavePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, user_id }: { post_id: string; user_id: string }) =>
      savePostMutation(post_id, user_id),
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.SAVE_POST],
      });
    },
  });
};

// ** Wrapper function around likePostMutation ** //
export const useLikePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      post_id,
      likes_count,
    }: {
      post_id: string;
      likes_count: string;
    }) => likePostMutation(post_id, likes_count),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_POST_BY_ID, data?.$id],
      });
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_ALL_POSTS],
      });
    },
  });
};

// ** Wrapper function around deletePostMutation ** //
export const useDeletePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, user_id }: { post_id: string; user_id: string }) =>
      deletePostMutation(post_id, user_id),
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_ALL_POSTS],
      });
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_RECENT_POSTS],
      });
    },
  });
};

// Wrapper function around deleteLikedPostMutation
export const useDeleteLikePost = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ post_id, user_id }: { post_id: string; user_id: string }) =>
      deleteLikedPostMutation(post_id, user_id),
    onSuccess: () => {
      QueryClient.invalidateQueries({
        queryKey: [PostQueryKeys.GET_ALL_POSTS],
      });
    },
  });
};

// ** Wrapper function around get recent posts ** //
export const useRecentPosts = ({ pageParam }: { pageParam: number }) => {
  const last_id = useQueryClient().getQueryData([
    PostQueryKeys.GET_RECENT_POSTS,
    pageParam - 1,
  ]);
  console.log('lastId', last_id);
  return useInfiniteQuery({
    queryKey: [PostQueryKeys.GET_RECENT_POSTS],
    queryFn: ({ pageParam }: { pageParam: number }) =>
      getRecentPostsMutation(pageParam, 10),
    getNextPageParam: (lastPage: any) => {
      const { nextPage, totalPages } = lastPage;
      if (nextPage <= totalPages) {
        return nextPage <= totalPages ? nextPage : undefined;
      } else {
        return undefined;
      }
    },
    initialPageParam: 1,
  });
};

export default {
  useInfinitePosts,
  useCreatePost,
  useUpdatePost,
  useRecentPosts,
};
