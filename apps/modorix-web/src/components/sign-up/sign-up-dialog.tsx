import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@modorix-ui/components/alert-dialog';
import { Button } from '@modorix-ui/components/button';
import { useState } from 'react';
import { signUp } from '../../adapters/gateways/http-user-gateway';
import { signUpUser } from '../../domain/modorix-user/user-sign-up-usecase';
import SignUpForm, { SignUpFromValues } from './sign-up-form';
import SignUpSuccess from './sign-up-success';

export function SignUpDialog() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [signedUpEmail, setSignedUpEmail] = useState<string | undefined>(undefined);

  async function handleSignUp(fromValues: SignUpFromValues): Promise<void> {
    const { signedUpEmail, errorMessage } = await signUpUser(fromValues, signUp);
    setSignedUpEmail(signedUpEmail);
    setErrorMessage(errorMessage);
  }

  function onOpenChanged(open: boolean): void {
    if (!open) {
      setErrorMessage(undefined);
      setSignedUpEmail(undefined);
    }
  }

  return (
    <AlertDialog onOpenChange={onOpenChanged}>
      <AlertDialogTrigger asChild>
        <Button>Sign up</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mx-auto">Join Modorix to improve your X experience</AlertDialogTitle>
        </AlertDialogHeader>
        {signedUpEmail ? (
          <SignUpSuccess email={signedUpEmail}>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </SignUpSuccess>
        ) : (
          <SignUpForm signUpErrorMessage={errorMessage} onSingUp={handleSignUp}>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </SignUpForm>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
