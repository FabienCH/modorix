import { AlertDialog, AlertDialogContent, AlertDialogTitle, AlertDialogTrigger } from '@modorix-ui/components/alert-dialog';
import { Button } from '@modorix-ui/components/button';
import { signUp } from '../../adapters/gateways/user-gateway';
import SignUpForm, { SignUpFromValues } from './sign-up-form';

export function SignUpDialog() {
  function handleSignUp(fromValues: SignUpFromValues): void {
    signUp(fromValues);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button>Sign up</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle className="mx-auto">Join Modorix to improve your X experience</AlertDialogTitle>
        <SignUpForm onSingUp={handleSignUp} />
      </AlertDialogContent>
    </AlertDialog>
  );
}
