import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import { useUserContext } from '@/lib/context/user/userContext';
import { useRegisterUserMutation } from '@/lib/react-query/userQueryMutations/UserQueryAndMutations';
import { UserSignUpValidation } from '@/lib/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const SignUpForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { verifyUser, setIsUserAuthenticated } = useUserContext();
  const navigate = useNavigate();
  // Use the useRegisterUser hook to get the mutation function
  const registerUserMutation = useRegisterUserMutation();
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserSignUpValidation>>({
    resolver: zodResolver(UserSignUpValidation),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof UserSignUpValidation>) {
    try {
      setIsLoading(true);
      // Call the registerUserMutation function with the form values
      const user = await registerUserMutation.mutateAsync({
        name: values.name,
        username: values.username,
        email: values.email,
        password: values.password,
      });

      if (!user) {
        return toast({
          title: 'Sign Up failed. Please try again.',
        });
      } else {
        toast({
          title: 'Sign Up successful. Checking authentication......',
        });
        const isAuthenticated = await verifyUser();
        if (isAuthenticated) {
          setIsUserAuthenticated(true);
          toast({
            title: 'User authenticated successfully.',
          });
          navigate('/');
        } else {
          toast({
            title: 'User authentication failed. Please log in.',
          });
          navigate('/sign-in');
        }
      }
      form.reset();
      console.log(user);
      return user;
    } catch (error) {
      toast({
        title: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
    return null;
  }

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img
          src="/assets/images/mylogo1.png"
          alt="Logo"
          className="w-24 h-24"
        />
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-light-3 ">
          Create a new account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          To use Metal-Brain, please enter your details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-3">Name</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    autoComplete="name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-3">Userame</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="shad-input"
                    {...field}
                    autoComplete="username"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-3">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    className="shad-input"
                    {...field}
                    autoComplete="email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-light-3">Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader />
              </div>
            ) : (
              'Sign Up'
            )}
          </Button>
          <p className="text-small-regular text-light-3 text-center mt-2">
            Already have an account?
            <Link to="/sign-in" className="text-light-8 text-small-bold ml-1">
              {' '}
              Log in
            </Link>
          </p>
        </form>
      </div>
    </Form>
  );
};

export default SignUpForm;
