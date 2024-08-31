import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/postcards/PostCard';
import UserStoryList from '@/components/shared/stories/UserStoryList';
import UserCard from '@/components/shared/usercards/UserCard';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllPosts } from '@/lib/react-query/postQueryMutations/PostQueryAndMutations';
import { useGetAllUsers } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { IUpdatePost } from '@/types';
import { useState } from 'react';

const Home = () => {
  const [limit] = useState(10);
  const [offset] = useState(0);

  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetAllPosts();

  const {
    data: users,
    isPending,
    isError: isUserError,
  } = useGetAllUsers({
    limit: String(limit),
    offset: String(offset),
  });

  const { toast } = useToast();

  if (isUserError) {
    toast({
      title: 'Error',
      description: 'Unable to fetch users',
    });
  }

  if (isErrorPosts) {
    toast({
      title: 'Error',
      description: 'Unable to fetch posts',
    });
  }

  if (isPending) {
    return <Loader />;
  }

  const creators = users.users ? users.users : users;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <UserStoryList />
        <div className="home-posts">
          <div className="flex justify-between w-full gap-60 mb-4">
            <h2 className="h3-bold md:h2-bold w-full">Home Feed</h2>
            <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
              <p className="small-medium md:base-medium text-light-2">All</p>
              <img
                src="/assets/icons/filter.svg"
                alt="filter"
                width={20}
                height={20}
              />
            </div>
          </div>
          {isPostLoading && !posts ? (
            <Loader />
          ) : (
            <ul className="flex flex-col flex-1 gap-9 w-full">
              {posts.map((post: IUpdatePost) => (
                <li key={post?.id} className="flex-1 min-w-w[200px] w-full">
                  <PostCard post={post} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="explore-creators">
        <div className="explore-creator-container">
          <div className="explore-inner_creator">
            <div className="flex gap-1 px-4 w-full bg-dark-4 rounded-lg">
              <img
                src="/assets/icons/search.svg"
                alt="search"
                width={24}
                height={24}
                className="flex-shrink-0"
              />
              <Input
                type="text"
                name="search"
                placeholder="Search top creators"
                className="explore-search"
              />
            </div>
          </div>
        </div>
        <div className="home-creators">
          <h2 className="h3-bold md:h2-bold text-light-1">Top Creators</h2>
          {isPending && !creators ? (
            <Loader />
          ) : (
            <ul className="user-grid">
              {creators?.map((creator: any) => (
                <li key={creator?.id} className="flex-1 min-w-w[200px] w-full">
                  <UserCard user={creator} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
