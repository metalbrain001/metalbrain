import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import { useFetchUserStories } from '@/lib/react-query/storiesQueryAndMutations/StoryQueryAndMutation';
import { timeAgo } from '@/lib/utils';
import { useState } from 'react';

const StoryViewer = ({ story }: any) => {
  const [selectedStory, setSelectStory] = useState(story);
  const { data: userStories, isLoading: isLoadingStories } =
    useFetchUserStories({
      limit: String(10),
      offset: String(0),
    });

  const handleCloseView = () => {
    setSelectStory(story);
  };

  const handleStoryClick = (story: any) => {
    setSelectStory(story);
  };

  if (isLoadingStories) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  const stories = userStories?.stories || [];

  console.log('story Url', selectedStory?.storyUrl);

  console.log('More stories', stories);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-4 bg-opacity-75 ">
      <div className="relative w-full max-w-3xl p-4 bg-dark-3 rounded-lg">
        <Button
          className="absolute top-2 right-2 text-white bg-red rounded-full p-2"
          onClick={() => {
            handleCloseView();
          }}
        >
          Close
        </Button>
        <img
          src={`/${selectedStory?.storyUrl}`}
          alt="story"
          className="w-full h-full object-contain rounded-lg"
        />
        {/* Story details */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center">
            <img
              src={selectedStory?.User?.profilePic}
              alt={selectedStory?.User?.username}
              className="w-12 h-12 rounded-full object-cover"
              onClick={() => {
                handleStoryClick(selectedStory);
              }}
            />
            <p className="ml-2 text-primary-500 small-regular md:base-semibold">
              {selectedStory?.User?.username}
            </p>
          </div>
          <p className="text-primary-500 small-regular md:base-semibold">
            {selectedStory?.created_at &&
              timeAgo(selectedStory?.created_at.toString())}
          </p>
        </div>
      </div>
    </div>
  );
};

export default StoryViewer;
