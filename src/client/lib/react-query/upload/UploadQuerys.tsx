import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getPreviewImageUrlMutation,
  getUserStoryPreviewUrlMutation,
  uploadImageMutation,
  uploadProfilePicMutation,
  uploadUserStoryMutation,
} from './UploadImageAPI';
import { UploadQueryKeys } from './UploadQueryKeys';

// Wrapper function around Upload Image Mutation
export const useUploadImage = () => {
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      uploadImageMutation(formData),
  });
};

// Wrapper function around getPreviewImage Mutation
export const useGetPreviewImage = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getPreviewImageUrlMutation(),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [UploadQueryKeys.GET_IMAGE_PREVIEW, data?.imageUrl],
      });
    },
  });
};

// ** Profile Picture Uploader **
export const useGetProfilePicPreview = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getPreviewImageUrlMutation(),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [UploadQueryKeys.GET_PROFILE_PIC_PREVIEW, data?.profilePic],
      });
    },
  });
};

// Wrapper function around upload profile picture Mutation
export const useUploadProfilePic = () => {
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      uploadProfilePicMutation(formData),
  });
};

// ** Wrapper function around useUploadUserstory ** //
export const useUploadUserStory = () => {
  return useMutation({
    mutationFn: ({ formData }: { formData: FormData }) =>
      uploadUserStoryMutation(formData),
  });
};

// ** Wrapper function around getUserStoryPreviewMutation ** //
export const useGetUserStoryPreview = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: () => getUserStoryPreviewUrlMutation(),
    onSuccess: data => {
      QueryClient.invalidateQueries({
        queryKey: [UploadQueryKeys.GET_USER_STORY_PREVIEW, data?.storyUrl],
      });
    },
  });
};

export default {
  useUploadImage,
  useGetPreviewImage,
  useGetProfilePicPreview,
  useUploadProfilePic,
  useUploadUserStory,
  useGetUserStoryPreview,
};
