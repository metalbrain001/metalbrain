import { useUserContext } from './userContext';

export const useUserAuth = () => {
  const { verifyUser, setIsUserAuthenticated } = useUserContext();
  return {
    verifyUser,
    setIsUserAuthenticated,
  };
};

export default { useUserAuth };
