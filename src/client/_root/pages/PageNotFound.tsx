import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="home-container">
      <h1>Page Not Found</h1>
      <Link to="/sign-in">
        <Button>Back</Button>
      </Link>
    </div>
  );
};

export default PageNotFound;
