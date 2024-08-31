import { Button } from '@/components/ui/button';
import { sidebarLinks } from '@/constants';
import { useUserContext } from '@/lib/context/user/userContext';
import { useLogoutUserMutation } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { INavLink } from '@/types';
import { useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';

// ** Left sidebar component
const LeftSideBar = () => {
  const { user, isUserLoading, setIsUserLoading, isUserAuthenticated } =
    useUserContext();

  const { mutate: signOut, isSuccess } = useLogoutUserMutation();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!setIsUserLoading && !isUserAuthenticated) {
      navigate('/sign-in');
    }
  }, [setIsUserLoading, isUserAuthenticated, navigate]);

  useEffect(() => {
    if (isSuccess) {
      navigate('/sign-in'); // Navigate to sign-in page on successful logout
      console.log('User logged out');
    }
  }, [isSuccess, navigate]);

  if (isUserLoading) {
    return <p>Loading user data...</p>;
  }

  if (!user) {
    return <p>Unable to load user data...</p>;
  }

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.jpg"
            alt="logo"
            loading="lazy"
            width={50}
            height={36}
          />
        </Link>
        {!user ? (
          <p>Loading user data...</p>
        ) : (
          <Link to={`/profile/${user?.id}`} className="flex gap-3 items-center">
            <img
              src={
                user?.profilePic && user.profilePic !== ''
                  ? `${user?.profilePic}`
                  : user?.avatarUrl
                    ? `${user?.avatarUrl}`
                    : '/assets/icons/profile-placeholder.svg'
              }
              alt="profile"
              className="h-14 w-14 rounded-full"
              loading="lazy"
            />
            <div className="flex flex-col">
              <p className="body-bold">
                {user.firstName} {user.lastName}
              </p>
              <p>@{user.username}</p>
            </div>
          </Link>
        )}

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            const isExternalLink = link.target === '_blank';
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive && 'bg-primary-700'}`}
              >
                {isExternalLink ? (
                  <a
                    href={link.route}
                    target="_blank"
                    rel={link.rel || 'noopener noreferrer'}
                    className="flex gap-4 items-center p-4"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      loading="lazy"
                      className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                    />
                    {link.label}
                  </a>
                ) : (
                  <NavLink
                    to={link.route}
                    className="flex gap-4 items-center p-4"
                  >
                    <img
                      src={link.imgURL}
                      alt={link.label}
                      loading="lazy"
                      className={`group-hover:invert-white ${isActive && 'invert-white'}`}
                    />
                    {link.label}
                  </NavLink>
                )}
              </li>
            );
          })}
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}
          >
            <img src="/assets/icons/logout.svg" alt="logout" loading="lazy" />
            <p className="small-medium lg:base-medium">Logout</p>
          </Button>
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => navigate('/settings')}
          >
            <img
              src="/assets/icons/setting.svg"
              alt="settings"
              loading="lazy"
            />
            <p className="small-medium lg:base-medium">Settings</p>
          </Button>
        </ul>
      </div>
    </nav>
  );
};

export default LeftSideBar;
