import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { toast } from '@modorix-ui/hooks/use-toast';

export function showErrorToast(title: string, error: AuthError['error']): void {
  const description =
    error === 'auth'
      ? `You are not logged in or your session has expired. Please login and try again.`
      : `An error occurred, please try again.`;
  toast({ title, description, variant: 'destructive' });
}
