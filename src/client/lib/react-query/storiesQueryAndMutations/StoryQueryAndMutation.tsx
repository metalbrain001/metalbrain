import { IStory } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getSelfStoryMutation,
  getUserStoryMutation,
  updateUserStoryMutation,
} from '../storiesAPIwrapper/StoryAPI';
import { StoryQueryKeys } from '../storyQueryKeys/StoryQueryKey';

// ** Wrapper function around fetchUserStories ** //
export const useFetchUserStories = ({
  limit,
  offset,
}: {
  limit: string;
  offset: string;
}) => {
  return useQuery({
    queryKey: [StoryQueryKeys.FETCH_USER_STORIES, limit, offset],
    queryFn: () => getUserStoryMutation(limit, offset),
    enabled: !!limit && !!offset,
  });
};
// ** Wrapper function around UpdateUserStoryMutation **  //
export const useUpdateUserStory = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ user_id, story }: { user_id: string; story: IStory }) =>
      updateUserStoryMutation(user_id, story),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [StoryQueryKeys.UPDATE_USER_STORY, data?.id],
      });
      QueryClient.invalidateQueries({
        queryKey: [StoryQueryKeys.FETCH_USER_STORIES],
      });
    },
  });
};

// ** Wrapper function around fetchUserStory ** //
export const useFetchSelfStory = ({ user_id }: { user_id: string }) => {
  return useQuery({
    queryKey: [StoryQueryKeys.FETCH_SELF_STORY, user_id],
    queryFn: () => getSelfStoryMutation(user_id),
    enabled: !!user_id,
  });
};

export default {
  useFetchUserStories,
  useUpdateUserStory,
  useFetchSelfStory,
};
