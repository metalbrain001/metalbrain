import { Button } from '@/components/ui/button';
import { IUser } from '@/types';
import { Link } from 'react-router-dom';

type UserCardProps = {
  user: IUser;
};

// ** UserCard Component
const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user?.id}`} className="user-card">
      <img
        src={
          user.profilePic
            ? `${user.profilePic}`
            : user.avatarUrl
              ? `${user.avatarUrl}`
              : '/assets/images/default-profile.jpg'
        }
        alt="creator"
        loading="lazy"
        className="rounded-full w-16 h-16"
      />
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.firstName} {user.lastName}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>
      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
