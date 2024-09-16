import { isUserSession } from '@modorix-commons/domain/login/type-guards/user-session-guard';
import { UserSession } from '@modorix/commons';

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
