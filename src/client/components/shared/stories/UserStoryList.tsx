// ** UserStoryList component for displaying user stories ** //
import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/lib/context/user/userContext';
import {
  useFetchSelfStory,
  useFetchUserStories,
} from '@/lib/react-query/storiesQueryAndMutations/StoryQueryAndMutation';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserStoryViewer from './UserStoryViewer';

const UserStoryList = () => {
  const { user } = useUserContext();
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const {
    data: userStories,
    isLoading: isLoadingStories,
    refetch: refetchUserStories,
  } = useFetchUserStories({
    limit: String(limit),
    offset: String(offset),
  });

  const { data: selfStory, refetch: refetchSelfStory } = useFetchSelfStory({
    user_id: String(user?.id),
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Refetch stories whenever the current user changes
    refetchUserStories();
    refetchSelfStory();
  }, [user, refetchUserStories, refetchSelfStory]);

  const handleLoadMore = () => {
    setOffset(prevoffset => prevoffset + limit);
  };

  const handleStoryClick = (story: any) => {
    setSelectedStory(story);
  };

  const handleAddStoryClick = () => {
    navigate(`/add-story/${user?.id}`); // Navigate to the story upload page
  };

  console.log('self story', selfStory);

  // Extract stories from the data response
  const followedUserStories = userStories?.story || [];

  // const userHasStory = followedUserStories.some(
  //   (story: any) => story.user_id === user?.id
  // );

  const groupedStories = followedUserStories.reduce((acc: any, story: any) => {
    if (!acc[story?.user_id]) {
      acc[story?.user_id] = [];
    }
    acc[story?.user_id].push(story);
    return acc;
  }, {});

  if (isLoadingStories) {
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );
  }

  if (followedUserStories.length === 0 && !selfStory?.story) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-center text-light-1">No stories available yet.</p>
      </div>
    );
  }

  if (Object.keys(groupedStories).length === 0 && !selfStory?.story) {
    return (
      <div className="flex-center w-full h-full">
        <p className="text-center text-light-1">No stories available yet.</p>
      </div>
    );
  }

  return (
    <div className="user-story-container cursor-pointer">
      {/* Display self story */}
      {selfStory && (
        <div className="user-story">
          <div className="user-story-pic" key={selfStory.story.id}>
            <div
              className="relative w-[90px] h-[90px] rounded-full border-4 border-transparent"
              onClick={handleAddStoryClick}
            >
              {/* Only render the ring if the story is unviewed */}
              <div
                className={`relative w-16 h-16 rounded-full border-4 ${
                  !selfStory?.story[0]?.viewed
                    ? 'border-rose-600'
                    : 'border-gray-300'
                }`}
                onClick={() => handleStoryClick(selfStory.story[0])}
              >
                <img
                  src={
                    user?.profilePic && user.profilePic !== ''
                      ? `${user?.profilePic}`
                      : selfStory?.avatarUrl
                        ? `${selfStory?.avatarUrl}`
                        : '/assets/icons/profile-placeholder.svg'
                  }
                  alt="User-Profile"
                  className="rounded-full w-14 h-14 object-cover"
                />
              </div>
              {(!selfStory || selfStory.story.length === 0) && (
                <div className="story-icon absolute inset-0 flex items-center justify-center">
                  <div className="story-cross-icon">
                    <img
                      src="/assets/icons/cross.svg"
                      width={16}
                      height={16}
                      alt="add story"
                      className="invert-white"
                    />
                  </div>
                  <div className="story-cover-icon">
                    <img
                      src="/assets/icons/cross-cover.svg"
                      width={28}
                      height={28}
                      alt="add story"
                      className="invert-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
          {followedUserStories.map((story: any) => (
            <div key={story.id} className="user-story-card">
              <div
                className="user-story-pic"
                onClick={() => handleStoryClick(story)}
              >
                <div
                  className={`relative w-16 h-16 rounded-full border-4 ${
                    !selfStory.story[0]?.viewed
                      ? 'border-rose-600'
                      : 'border-gray-300'
                  }`}
                  onClick={() => handleStoryClick(selfStory.story[0])}
                >
                  <img
                    src={
                      story.User?.profilePic && story.User?.profilePicer !== ''
                        ? `${story.User?.profilePic}`
                        : story.User?.avatarUrl
                          ? `${story.User?.avatarUrl}`
                          : '/assets/icons/profile-placeholder.svg'
                    }
                    alt="User-Profile"
                    className="rounded-full w-14 h-14 object-cover"
                  />
                </div>
              </div>
              <div className="text-center">
                <p className="text-light-1 text-xs font-semibold">
                  {story.User?.username}
                </p>
              </div>
            </div>
          ))}
          <div className="load-arrow-button">
            <div className="arrow-button" onClick={handleLoadMore}>
              <img
                src="/assets/icons/arrow.svg"
                alt="filter"
                width={26}
                height={26}
                className="arrow-icon"
              />
            </div>
          </div>
        </div>
      )}
      {/* Display other users' stories */}
      {selectedStory && (
        <div className="absolute inset-0 z-50">
          <UserStoryViewer
            story={selectedStory}
            onClose={() => setSelectedStory(null)}
          />
        </div>
      )}
      {/* <div className="my-story-text-container">
        <p className="my-story-text">
          {userHasStory ? 'My Story' : 'Add Story'}
        </p>
      </div> */}
      <div className="my-story-text-container">
        <p className="my-story-text">
          {selfStory.story && selfStory.story.length > 0
            ? 'Your Story'
            : 'Add Story'}
        </p>
      </div>
    </div>
  );
};

export default UserStoryList;
