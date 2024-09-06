import { SignUpUserRequest } from '@modorix/commons';

const usersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export async function signUp({
  email,
  password,
  confirmPassword,
}: SignUpUserRequest): Promise<void | { error: 'email-used' | 'unknown-error' }> {
  const signUpResponse = await fetch(`${usersBaseUrl}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
  const signUpTextResponse = await signUpResponse.text();
  if (!signUpTextResponse) {
    return;
  }

  return handleJsonError(signUpTextResponse);
}

async function handleJsonError(signUpTextResponse: string): Promise<{ error: 'email-used' | 'unknown-error' }> {
  const signUpJsonResponse = JSON.parse(signUpTextResponse);
  const responseHasErrorMessage = typeof signUpJsonResponse === 'object' && 'message' in signUpJsonResponse;
  if (responseHasErrorMessage && signUpJsonResponse.message.match(/^Email .* is already used$/)) {
    return { error: 'email-used' };
  }
  return { error: 'unknown-error' };
}
