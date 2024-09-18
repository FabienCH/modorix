import { isUserSession } from '@modorix-commons/domain/login/type-guards/user-session-guard';
import { UserSession } from '@modorix/commons';

export async function confirmUserSignUp(
  runConfirmSignUp: () => Promise<UserSession | { error: 'expired' | 'other' }>,
  onConfirmed: (userSession: UserSession) => void,
  onError: (error: 'expired' | 'other') => void,
): Promise<void> {
  const confirmSignUpResult = await runConfirmSignUp();

  if (isUserSession(confirmSignUpResult)) {
    onConfirmed(confirmSignUpResult);
    return;
  }

  onError(confirmSignUpResult.error);
}
