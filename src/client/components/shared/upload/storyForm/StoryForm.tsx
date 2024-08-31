import Loader from '@/components/shared/Loader';
import StoryUploader from '@/components/shared/upload/StoryUploader';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useUserContext } from '@/lib/context/user/userContext';
import { useUpdateUserStory } from '@/lib/react-query/storiesQueryAndMutations/StoryQueryAndMutation';
import { useGetUserByIdMutation } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { UserStoryValidation } from '@/lib/validations/index';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

const StoryForm = () => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const { user, setUser } = useUserContext();
  const { id } = useParams();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof UserStoryValidation>>({
    resolver: zodResolver(UserStoryValidation),
    defaultValues: {
      file: [],
      location: '',
    },
  });

  const { data: currentUser } = useGetUserByIdMutation({
    user_id: String(id),
  });
  const { mutateAsync: updateStory, isPending: isPendingUpdate } =
    useUpdateUserStory();

  if (isPendingUpdate) return <Loader />;

  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  const handleUpdate = async (value: z.infer<typeof UserStoryValidation>) => {
    const { file, location } = value;
    const formData = new FormData();
    formData.append('file', file[0]);
    formData.append('location', location);
    try {
      const response = await updateStory({
        user_id: currentUser.id,
        story: {
          id: currentUser.id,
          user_id: currentUser.id,
          storyUrl: fileUrl || '',
          created_at: new Date(),
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000),
          User: currentUser,
        },
      });
      setUser(response.data);
      setFileUrl(response.data.storyUrl);
    } catch (error) {
      console.error('Error updating story:', error);
    }
    setUser({
      ...currentUser,
      storyUrl: fileUrl || '',
    });
    return navigate(`/profile/${user?.id}`);
  };

  return (
    <div className="upload-story-container p-6 bg-white rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-700">Add to story</h2>
        <img
          src="/assets/icons/edit.svg"
          width={36}
          height={36}
          alt="edit"
          className="text-gray-500"
        />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleUpdate)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="file"
            render={({ field }) => (
              <>
                <FormItem className="flex flex-col">
                  <FormLabel htmlFor="fileInput" className="text-gray-600">
                    Upload Image or Video
                  </FormLabel>
                  <FormControl>
                    <StoryUploader
                      fieldChange={field.onChange}
                      mediaUrl={currentUser?.users?.profilePic}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              </>
            )}
          />
          <button
            type="submit"
            className="w-full py-3 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPendingUpdate ? 'Uploading...' : 'Add to Story'}
          </button>
        </form>
      </Form>
      {fileUrl && (
        <div className="mt-6">
          <img
            src={fileUrl}
            alt="story-previewer"
            className="w-full rounded-lg shadow-lg"
          />
          <p className="mt-2 text-center text-sm text-green-500">
            Story uploaded and will expire in 24 hours
          </p>
        </div>
      )}
    </div>
  );
};

export default StoryForm;
