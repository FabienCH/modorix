import { LoginUserRequest, UserSession } from '@modorix/commons';
import { LoginError, LoginGateway } from './gateways/user-gateway';
import { isUserSession } from './type-guards/user-session-guard';

export async function loginUser(
  loginUserRequest: LoginUserRequest,
  loginGateway: LoginGateway,
  onLoggedIn: (userSession: UserSession) => void,
): Promise<{ successMessage: string | undefined; errorMessage: string | undefined }> {
  const loginResponse = await loginGateway(loginUserRequest);
  const isResponseUserSession = isUserSession(loginResponse);
  if (isResponseUserSession) {
    onLoggedIn(loginResponse);
  }

  const errorMessage = getErrorMessage(loginResponse);
  return {
    errorMessage,
    successMessage: isResponseUserSession ? 'You have been successfully logged in, this window will close.' : undefined,
  };
}

function getErrorMessage(loginResponse: UserSession | LoginError): string | undefined {
  if ('error' in loginResponse) {
    if (loginResponse.error === 'invalid-credentials') {
      return 'Your email or password is incorrect.';
    }
    if (loginResponse.error === 'email-not-confirmed') {
      return 'Your email has not been confirmed. Please check your mailbox for a "Confirm your signup to Modorix" email.';
    }
    return 'An unknown error occurred, please try again.';
  }
  return;
}
