import { toast } from '@modorix-ui/hooks/use-toast';
import { UserSessionInfos } from '@modorix/commons';
import { AuthError } from '../gateways/fetch-with-auth';

export function showErrorToast(
  title: string,
  error: AuthError['error'],
  setUserSessionInfos: (userSessionInfos: UserSessionInfos | null) => void,
): void {
  if (error === 'auth') {
    setUserSessionInfos(null);
  }

  const description =
    error === 'auth'
      ? `You are not logged in or your session has expired. Please login and try again.`
      : `An error occurred, please try again.`;
  toast({ title, description, variant: 'destructive' });
}
