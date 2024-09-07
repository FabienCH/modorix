import { ConfirmSignUpUserRequest, SignUpUserRequest, UserSession } from '@modorix/commons';
import { isUserSession } from '../../domain/type-guards/user-session-guard';

const usersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export async function signUp(signUpUserRequest: SignUpUserRequest): Promise<Response> {
  return await fetch(`${usersBaseUrl}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(signUpUserRequest),
  });
}

export async function confirmSignUp(
  confirmSignUpUserRequest: ConfirmSignUpUserRequest,
): Promise<UserSession | { error: 'expired' | 'other' }> {
  const response = await (
    await fetch(`${usersBaseUrl}/sign-up/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(confirmSignUpUserRequest),
    })
  ).json();
  console.log('🚀 ~ response:', response);

  if (isUserSession(response)) {
    return response;
  }
  return { error: response.message === 'otp_expired' ? 'expired' : 'other' };
}
