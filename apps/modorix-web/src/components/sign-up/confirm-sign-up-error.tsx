import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@modorix-ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@modorix-ui/components/form';
import { Input } from '@modorix-ui/components/input';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { resendAccountConfirmation } from '../../adapters/gateways/modorix-user-gateway';

const ResendLinkFormSchema = z.object({
  email: z.string({ message: 'Email address is required.' }).email('Email address is invalid.'),
});

export type ResendLinkFromValues = z.infer<typeof ResendLinkFormSchema>;

export default function ConfirmSignUpError({ confirmError }: { confirmError: 'expired' | 'other' }) {
  const [emailSubmitted, setEmailSubmitted] = useState<boolean>(false);
  const signUpForm = useForm<ResendLinkFromValues>({
    resolver: zodResolver(ResendLinkFormSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  async function resendLink({ email }: ResendLinkFromValues) {
    await resendAccountConfirmation(email);
    setEmailSubmitted(true);
  }

  return confirmError === 'expired' ? (
    <>
      <p className="text-center text-xl text-destructive pt-3">Your link has expired, you can request a new one.</p>
      <Form {...signUpForm}>
        <form className="max-w-lg m-auto py-6" onSubmit={signUpForm.handleSubmit(resendLink)}>
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

          <div className="flex mt-5 justify-center">
            <Button
              type="submit"
              className="ml-4"
              disabled={signUpForm.formState.isSubmitted && !!Object.values(signUpForm.formState.errors).length}
            >
              Send new link
            </Button>
          </div>
        </form>
        {emailSubmitted ? (
          <p className="text-center text-modorix-800">If you created an account with this email, you will receive a new link</p>
        ) : null}
      </Form>
    </>
  ) : (
    <p className="text-center text-xl text-destructive pt-3">An error occurred, try to confirm your email again.</p>
  );
}
