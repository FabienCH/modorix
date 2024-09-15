import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@modorix-ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@modorix-ui/components/form';
import { Input } from '@modorix-ui/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const LoginUpFormSchema = z.object({
  email: z.string({ message: 'Email address is required.' }).email('Email address is invalid.'),
  password: z.string({ message: 'Password is required.' }),
});

export type LoginFromValues = z.infer<typeof LoginUpFormSchema>;

export default function LoginForm({
  loginErrorMessage,
  onLogin,
  children,
}: {
  loginErrorMessage: string | undefined;
  onLogin: (formValues: LoginFromValues) => void;
  children: React.ReactNode;
}) {
  const loginForm = useForm<LoginFromValues>({
    resolver: zodResolver(LoginUpFormSchema),
    mode: 'onTouched',
    defaultValues: { email: '', password: '' },
  });

  return (
    <Form {...loginForm}>
      <form onSubmit={loginForm.handleSubmit(onLogin)}>
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem className="mt-4">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {loginErrorMessage ? <p className="text-destructive text-sm font-medium mt-3">{loginErrorMessage}</p> : null}
        <div className="flex mt-5 justify-center">
          {children}
          <Button
            type="submit"
            className="ml-4"
            disabled={loginForm.formState.isSubmitted && !!Object.values(loginForm.formState.errors).length}
          >
            Login
          </Button>
        </div>
      </form>
    </Form>
  );
}
