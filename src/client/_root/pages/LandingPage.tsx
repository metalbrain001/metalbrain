import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="home-container">
      <h1>Welcome to MetalBrain</h1>
      <Link to="/sign-in">
        <Button>Sign In</Button>
      </Link>
      <Link to="/sign-up">
        <Button>Sign Up</Button>
      </Link>
    </div>
  );
};

export default LandingPage;
