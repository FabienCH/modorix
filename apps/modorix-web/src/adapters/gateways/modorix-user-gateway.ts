import { isUserSession } from '@modorix-commons/domain/login/type-guards/user-session-guard';
import { ConfirmSignUpUserRequest, UserSession } from '@modorix/commons';

const usersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

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

  if (isUserSession(response)) {
    return response;
  }
  return { error: response.message === 'otp_expired' ? 'expired' : 'other' };
}

export async function resendAccountConfirmation(email: string): Promise<void> {
  await fetch(`${usersBaseUrl}/sign-up/resend-account-confirmation`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
}
