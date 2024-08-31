('use client');
import { Checkbox } from '@/components/ui/checkbox';
import { Link } from 'react-router-dom';

export function TermsAndConditions() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms1" />
      <div className="grid gap-1.5 leading-none">
        <label
          htmlFor="terms1"
          className="text-small-regular font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-light-3"
        >
          I agree to the{' '}
          <Link to="/terms" className="text-light-8 text-small-bold mb-4">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-light-8 text-small-bold">
            Privacy Policy
          </Link>
        </label>
      </div>
    </div>
  );
}

export default TermsAndConditions;
