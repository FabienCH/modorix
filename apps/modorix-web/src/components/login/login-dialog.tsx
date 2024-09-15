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
import { login } from '../../adapters/gateways/http-user-gateway';
import { loginUser } from '../../domain/user-login-usecase';
import LoginForm, { LoginFromValues } from './login-form';

export function LoginDialog() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);

  async function handleLogin(fromValues: LoginFromValues): Promise<void> {
    const { errorMessage } = await loginUser(fromValues, login);
    setErrorMessage(errorMessage);
    if (!errorMessage) {
      setOpen(false);
    }
  }

  function onOpenChanged(open: boolean): void {
    setOpen(open);
    if (!open) {
      setErrorMessage(undefined);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChanged}>
      <AlertDialogTrigger asChild>
        <Button className="mr-2" variant={'outline'}>
          Login
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="mx-auto">Login to Modorix</AlertDialogTitle>
        </AlertDialogHeader>
        <LoginForm loginErrorMessage={errorMessage} onLogin={handleLogin}>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </LoginForm>
      </AlertDialogContent>
    </AlertDialog>
  );
}
