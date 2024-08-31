import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useDebounce } from '@/hooks/useDebounce';
import useRefreshStatus from '@/hooks/useRefreshStatus';
import { useUserContext } from '@/lib/context/user/userContext';
import {
  useFollowUserMutation,
  useGetFollowStatus,
  useGetUserByIdMutation,
  useGetUserFollowers,
  useGetUserFollowing,
} from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';

// ** StatBlock Component
interface StatBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StatBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// ** Profile Component ** //
const Profile = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const { user } = useUserContext();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [followerCount, setFollowerCount] = useState<number>(0);
  const [followingCount, setFollowingCount] = useState<number>(0);
  const [status, setStatus] = useState<'follow' | 'unfollow' | 'self'>(
    'follow'
  );
  const debouncedFollower_id = useDebounce(String(user?.id) || '', 500);
  const debouncedFollowing_id = useDebounce(String(id) || '', 500);
  const { toast } = useToast();

  const followUserMutation = useFollowUserMutation();

  // ** Fetch the current user's profile by ID ** //
  const { data: currentUser, isPending } = useGetUserByIdMutation({
    user_id: String(id!),
  });

  const { data: followers, refetch: refetchFollowers } = useGetUserFollowers({
    user_id: Number(id),
  });

  const { data: following, refetch: refetchFollowing } = useGetUserFollowing({
    user_id: Number(id),
  });

  const { data: followStatus, isLoading: followStatusPending } =
    useGetFollowStatus({
      follower_id: Number(user?.id!),
      following_id: Number(id!),
      status,
    });

  const { refreshStatus, error } = useRefreshStatus(
    debouncedFollower_id,
    debouncedFollowing_id
  );

  useEffect(() => {
    if (followStatus) {
      if (followStatus.status === 'self') {
        setIsFollowing(false);
        setStatus('self');
      } else {
        setIsFollowing(followStatus.status === 'follow');
        setStatus(followStatus.status === 'follow' ? 'follow' : 'unfollow');
      }
    }
  }, [followStatus]);

  useEffect(() => {
    if (Array.isArray(followers)) {
      setFollowerCount(followers?.length);
    }
    if (Array.isArray(following)) {
      setFollowingCount(following?.length);
    }
  }, [followers, following]);

  if (error) {
    console.error('Error refreshing status:', error);
    toast({
      title: 'Error',
      description: 'There was an error refreshing the follow status',
      variant: 'destructive',
    });
  }

  const handleFollow = async () => {
    try {
      const newStatus = status === 'follow' ? 'unfollow' : 'follow';
      await followUserMutation.mutateAsync({
        follower_id: user?.id!,
        following_id: Number(id!),
        status: newStatus,
      });
      await refreshStatus();
      setStatus(newStatus);
      setIsFollowing(newStatus === 'unfollow');
      toast({
        title: `${newStatus === 'follow' ? 'Followed' : 'Unfollowed'} ${currentUser?.user?.username}`,
        description: `You have ${newStatus === 'follow' ? 'followed' : 'unfollowed'} ${currentUser?.user?.username}`,
      });
      refetchFollowers();
      refetchFollowing();
    } catch (error) {
      console.error('Error following/unfollowing user:', error);
      toast({
        title: 'Error',
        description: 'There was an error following/unfollowing the user',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              currentUser?.user?.profilePic
                ? `${currentUser?.user?.profilePic}`
                : currentUser?.user?.avatarUrl
                  ? `${currentUser?.user?.avatarUrl}`
                  : '/assets/icons/profile-placeholder.svg'
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser?.user?.firstName} {currentUser?.user?.lastName}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser?.user?.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              {/* <StatBlock value={currentUser?.post?.length || 0} label="Posts" /> */}
              <StatBlock value={followerCount} label="Followers" />
              <StatBlock value={followingCount} label="Following" />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser?.user?.bio}
            </p>
          </div>
          <div className="flex justify-center gap-4">
            <div
              className={`${user?.id !== currentUser?.user?.id && 'hidden'}`}
            >
              <Link
                to={`/update-profile/${currentUser?.user?.id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user?.id !== currentUser?.user?.id && 'hidden'
                }`}
              >
                <img
                  src={'/assets/icons/edit.svg'}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div
              className={`${user?.id === currentUser?.user?.id && 'hidden'}`}
            >
              {status === 'self' ? (
                <Button
                  type="button"
                  className="shad-button_primary px-8"
                  disabled
                >
                  Follow
                </Button>
              ) : (
                <Button
                  type="button"
                  className="shad-button_primary px-8"
                  onClick={handleFollow}
                  disabled={
                    followUserMutation.isPending ||
                    followStatusPending ||
                    isPending
                  }
                >
                  {followUserMutation.isPending ||
                  followStatusPending ||
                  isPending
                    ? 'Loading...'
                    : status === 'follow'
                      ? 'Unfollow'
                      : 'Follow'}
                </Button>
              )}
              <div className="py-2 flex justify-center">
                <p className="text-lg font-semibold text-light-3">
                  {isFollowing && !isPending
                    ? `following ${currentUser?.user?.username}`
                    : `not following ${currentUser?.user?.username}`}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {currentUser?.user?.id === user?.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${currentUser?.user?.id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${currentUser?.user?.id}` && '!bg-dark-3'
            }`}
          >
            <img
              src={'/assets/icons/posts.svg'}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          <Link
            to={`/profile/${currentUser?.user?.id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${currentUser?.user?.id}/liked-posts` &&
              '!bg-dark-3'
            }`}
          >
            <img
              src={'/assets/icons/like.svg'}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
        </div>
      )}
      <Outlet />
    </div>
  );
};

export default Profile;
