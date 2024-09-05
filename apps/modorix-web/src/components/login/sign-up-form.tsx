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

export default function SignUpForm({ onSingUp }: { onSingUp: (formValues: SignUpFromValues) => void }) {
  const signUpForm = useForm<SignUpFromValues>({
    resolver: zodResolver(SignUpFormSchema),
    mode: 'onTouched',
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordsMissmatchError = signUpForm.formState.errors.root?.passwordsMissmatch;

  function checkPasswords(): void {
    const { errors } = signUpForm.formState;
    const formValue = signUpForm.getValues();
    const arePasswordMatching = formValue.confirmPassword === formValue.password;
    const arePasswordsValid = !signUpForm.formState.errors.confirmPassword && !errors.password;
    if (!arePasswordMatching && arePasswordsValid) {
      signUpForm.setError('root.passwordsMissmatch', { message: 'Passwords must be the same' });
    }
    if (arePasswordMatching && passwordsMissmatchError) {
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
                {passwordsMissmatchError ? (
                  <p className="text-destructive text-sm font-medium">{passwordsMissmatchError?.message}</p>
                ) : null}
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          disabled={signUpForm.formState.isSubmitted && !!Object.values(signUpForm.formState.errors).length}
          className="flex mt-5 mx-auto"
        >
          Sign up
        </Button>
      </form>
    </Form>
  );
}
