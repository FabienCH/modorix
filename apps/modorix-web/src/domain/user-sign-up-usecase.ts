import { SignUpUserRequest } from '@modorix/commons';
import { SignUpGateway } from './gateways/user-gateway';

export async function signUpUser(
  signUpUserRequest: SignUpUserRequest,
  signUpGateway: SignUpGateway,
): Promise<{ errorMessage: string | undefined; signedUpEmail: string | undefined }> {
  const signUpResponseWithError = await signUpGateway(signUpUserRequest);
  const errorMessage = getErrorMessage(signUpResponseWithError);

  return { signedUpEmail: errorMessage ? undefined : signUpUserRequest.email, errorMessage };
}

function getErrorMessage(signUpResponseWithError: void | { error: 'email-used' | 'unknown-error' }): string | undefined {
  if (signUpResponseWithError) {
    const errorMessage =
      signUpResponseWithError.error === 'email-used' ? 'Email is already used.' : 'An unknown error occurred, please try again.';
    return errorMessage;
  }
  return;
}
