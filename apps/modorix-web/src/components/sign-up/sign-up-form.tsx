import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@modorix-ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@modorix-ui/components/form';
import { Input } from '@modorix-ui/components/input';
import { passwordCharactersRegexp } from '@modorix/commons';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const SignUpFormSchema = z.object({
  email: z.string({ message: 'Email address is required.' }).email('Email address is invalid.'),
  password: z
    .string({ message: 'Password is required.' })
    .min(8, { message: 'Password must be at least 8 characters.' })
    .regex(passwordCharactersRegexp, {
      message: 'Your password must contains at least 1 uppercase letter, 1 lowercase letter and 1 digit',
    }),
  confirmPassword: z.string({ message: 'Password is required.' }).min(8, { message: 'Password must be at least 8 characters.' }),
});

export type SignUpFromValues = z.infer<typeof SignUpFormSchema>;

export default function SignUpForm({
  signUpErrorMessage,
  onSingUp,
  children,
}: {
  signUpErrorMessage: string | undefined;
  onSingUp: (formValues: SignUpFromValues) => void;
  children: React.ReactNode;
}) {
  const signUpForm = useForm<SignUpFromValues>({
    resolver: zodResolver(SignUpFormSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  function checkPasswords(): void {
    const currentPasswordsMissmatchError = signUpForm.formState.errors.root?.passwordsMissmatch;
    const { errors } = signUpForm.formState;
    const formValue = signUpForm.getValues();
    const arePasswordMatching = formValue.confirmPassword === formValue.password;
    const arePasswordsValid = !signUpForm.formState.errors.confirmPassword && !errors.password;
    if (!arePasswordMatching && arePasswordsValid) {
      signUpForm.setError('root.passwordsMissmatch', { message: 'Passwords must be the same' });
    }
    if (arePasswordMatching && currentPasswordsMissmatchError) {
      signUpForm.clearErrors('root.passwordsMissmatch');
    }
  }

  return (
    <Form {...signUpForm}>
      <form onSubmit={signUpForm.handleSubmit(onSingUp)}>
        <FormField
          control={signUpForm.control}
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
          control={signUpForm.control}
          name="password"
          render={({ field }) => {
            return (
              <FormItem className="mt-4">
                <FormLabel>Password</FormLabel>
                <FormControl onChange={checkPasswords}>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={signUpForm.control}
          name="confirmPassword"
          render={({ field }) => {
            return (
              <FormItem className="mt-4">
                <FormLabel>Confirm password</FormLabel>
                <FormControl onChange={checkPasswords}>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
                {signUpForm.formState.errors.root?.passwordsMissmatch?.message ? (
                  <p className="text-error">{signUpForm.formState.errors.root?.passwordsMissmatch?.message}</p>
                ) : null}
                {signUpErrorMessage ? <p className="text-error">{signUpErrorMessage}</p> : null}
              </FormItem>
            );
          }}
        />
        <div className="flex mt-5 justify-center">
          {children}
          <Button
            type="submit"
            className="ml-4"
            disabled={signUpForm.formState.isSubmitted && !!Object.values(signUpForm.formState.errors).length}
          >
            Sign up
          </Button>
        </div>
      </form>
    </Form>
  );
}
