import { useVerifyUserMutation } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { IUser } from '@/types';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

export type userContextType = {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  verifyUser: () => Promise<boolean>;
  isUserLoading: boolean;
  setIsUserLoading: Dispatch<SetStateAction<boolean>>;
  isUserAuthenticated: boolean;
  setIsUserAuthenticated: Dispatch<SetStateAction<boolean>>;
  authUser: (user: IUser) => void;
  setAuthUser: Dispatch<SetStateAction<{}>>;
  isFollowing: boolean;
  setIsFollowing: Dispatch<SetStateAction<boolean>>;
};

const UserContext = createContext<userContextType>({
  user: null,
  setUser: () => {},
  verifyUser: async () => {
    return await Promise.resolve(true);
  },
  isUserLoading: false,
  setIsUserLoading: () => false,
  isUserAuthenticated: false,
  setIsUserAuthenticated: () => false,
  authUser: () => {},
  setAuthUser: () => {},
  isFollowing: false,
  setIsFollowing: () => false,
});

export const useUserContext = () => useContext(UserContext);

type UserProviderProps = {
  children: React.ReactNode;
};

export default function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);
  const [isUserAuthenticated, setIsUserAuthenticated] =
    useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  const userMutation = useVerifyUserMutation();

  const navigate = useNavigate();

  const verifyUser = async () => {
    try {
      const response = await userMutation.mutateAsync();
      const currentuser = response.user;
      if (currentuser) {
        setIsUserAuthenticated(true);
        setUser(currentuser);
        return true;
      } else {
        setIsUserLoading(false);
        return false;
      }
    } catch (error) {
      console.log('Error in checking user', error);
      setIsUserAuthenticated(false);
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    const verifyUserAsync = async () => {
      try {
        const loggedIn = await verifyUser();
        if (!loggedIn) {
          console.log('User not logged in', `User: ${user}`);
          navigate('/sign-in', { replace: true });
        } else {
          console.log('User logged in', `User: ${user}`);
        }
      } catch (error: any) {
        console.error('Error in verifying user:', error);
        setIsUserAuthenticated(false);
      }
    };

    verifyUserAsync();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        verifyUser: async () => {
          return await Promise.resolve(true);
        },
        isUserLoading,
        setIsUserLoading,
        isUserAuthenticated,
        setIsUserAuthenticated,
        authUser: setUser,
        setAuthUser: () => {},
        isFollowing,
        setIsFollowing,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export { UserContext };
