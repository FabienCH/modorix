import { UserSession } from '@modorix/commons';
import { isUserSession } from './type-guards/user-session-guard';

export async function confirmUserSignUp(
  runConfirmSignUp: () => Promise<UserSession | { error: 'expired' | 'other' }>,
  onConfirm: (userSession: UserSession) => void,
  onError: (error: 'expired' | 'other') => void,
): Promise<void> {
  const confirmSignUpResult = await runConfirmSignUp();

  if (isUserSession(confirmSignUpResult)) {
    onConfirm(confirmSignUpResult);
    return;
  }

  onError(confirmSignUpResult.error);
}
