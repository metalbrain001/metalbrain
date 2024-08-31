import Loader from '@/components/shared/Loader';
import UserCard from '@/components/shared/usercards/UserCard';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useGetAllUsers } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';

const AllUsers = () => {
  const {
    data: users,
    isPending,
    isError: isUserError,
  } = useGetAllUsers({
    limit: '10',
    offset: '0',
  });
  const { toast } = useToast();

  if (isUserError) {
    toast({
      title: 'Error',
      description: 'Unable to fetch users',
    });
  }

  if (isPending) {
    return <Loader />;
  }

  const creators = users?.users ? Object.values(users.users) : [];

  console.log('Top creators from All users page', creators);

  return (
    <div className="common-container">
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
            placeholder="Search top users"
            className="explore-search"
          />
        </div>
      </div>
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {creators?.length === 0 ? (
          <p>No creators found.</p>
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
  );
};

export default AllUsers;
