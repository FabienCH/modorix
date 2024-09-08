import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@modorix-ui/components/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@modorix-ui/components/form';
import { Input } from '@modorix-ui/components/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const ResendLinkFormSchema = z.object({
  email: z.string({ message: 'Email address is required.' }).email('Email address is invalid.'),
});

export type ResendLinkFromValues = z.infer<typeof ResendLinkFormSchema>;

export default function ResendConfirmLinkForm({ handleSubmit }: { handleSubmit: ({ email }: ResendLinkFromValues) => void }) {
  const signUpForm = useForm<ResendLinkFromValues>({
    resolver: zodResolver(ResendLinkFormSchema),
    mode: 'onTouched',
    defaultValues: { email: '' },
  });

  return (
    <Form {...signUpForm}>
      <form className="max-w-lg m-auto py-6" onSubmit={signUpForm.handleSubmit(handleSubmit)}>
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
    </Form>
  );
}
