import LoginForm, { LoginFromValues } from '@modorix-commons/components/login-form';
import { loginUser } from '@modorix-commons/domain/login/user-login-usecase';
import { login } from '@modorix-commons/gateways/http-user-gateway';
import { useDependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { useUserSessionInfos } from '@modorix-commons/infrastructure/user-session-context';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@modorix-ui/components/alert-dialog';
import { Button } from '@modorix-ui/components/button';
import { getUserInfosFromStorage, saveUserSessionInStorage, UserSession } from '@modorix/commons';
import { useState } from 'react';

export function LoginDialog() {
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState(false);
  const { setUserSessionInfos } = useUserSessionInfos();
  const { dependencies } = useDependenciesContext();

  async function onLoggedIn(userSession: UserSession) {
    await saveUserSessionInStorage(userSession, dependencies.userSessionStorage.setItem);
    setUserSessionInfos(await getUserInfosFromStorage(dependencies.userSessionStorage.getItem));
    setOpen(false);
  }

  async function handleLogin(fromValues: LoginFromValues): Promise<void> {
    const { errorMessage } = await loginUser(fromValues, login, onLoggedIn);
    setErrorMessage(errorMessage);
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
