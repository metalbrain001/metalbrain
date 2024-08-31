import { Route, Routes } from 'react-router-dom';
import '../globals.css';
import AuthUserLayout from './_auth/AuthLayout';
import { default as SignInForm } from './_auth/forms/SignInForm';
import SignUpForm from './_auth/forms/SignUpForm';
import RequireAuthentication from './_auth/RequireAuthentication';
import { Home, PageNotFound } from './_root/pages';
import { Explore } from './_root/pages/explore';
import { CreatePost, LikedPost, SavedPost } from './_root/pages/posts';
import PostDetails from './_root/pages/posts/PostDetails';
import { EditPost, Settings, UpdateProfile } from './_root/pages/settings';
import { StoryViewer } from './_root/pages/stories';
import { AllUsers, Profile } from './_root/pages/users';
import RootLayout from './_root/RootLayout';
import UserStoryViewer from './components/shared/stories/UserStoryViewer';
import { StoryForm } from './components/shared/upload';
import { Toaster } from './components/ui/toaster';
const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        {/* Public Routes */}
        <Route element={<AuthUserLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
        </Route>

        {/* Private Routes */}
        <Route element={<RequireAuthentication />}>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/saved" element={<SavedPost />} />
            <Route path="/all-users" element={<AllUsers />} />
            <Route path="/create-post" element={<CreatePost />} />.
            <Route path="/update-post/:id" element={<EditPost />} />
            <Route path="/posts/:id" element={<PostDetails />} />
            <Route path="/liked" element={<LikedPost />} />
            <Route path="/update-profile/:id" element={<UpdateProfile />} />
            <Route path="/add-story/:id" element={<StoryForm />} />
            <Route path="/story" element={<StoryViewer />} />
            <Route path="/story/:id" element={<UserStoryViewer />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>
        {/* Not found */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Toaster />
    </main>
  );
};

export default App;
