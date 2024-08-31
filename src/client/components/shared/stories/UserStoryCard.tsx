import { IStory } from '@/types';
import { Link } from 'react-router-dom';

type UserStoryCardProps = {
  story: IStory;
  onClick?: () => void;
};

// ** UserCard Component
const UserStoryCard = ({ story, onClick }: UserStoryCardProps) => {
  const user = story.User;
  if (!user) {
    console.error('User data is missing in story:', story);
    return null; // Early return if there's no user data
  }
  console.log('User Story Card', user);
  return (
    <Link to={`/profile/${story?.id}`}>
      <div className="user" onClick={onClick}>
        <img
          src={
            story.storyUrl && story.storyUrl !== ''
              ? `/${story.storyUrl}`
              : '/assets/images/profile-placeholder.svg'
          }
          alt="creator-story"
          loading="lazy"
          className="relative rounded-full w-16 h-16 object-cover"
        />
        <div className="text-center mt-2">
          <p className="text-light-1 small-medium">{user?.username}</p>
        </div>
      </div>
    </Link>
  );
};

export default UserStoryCard;
