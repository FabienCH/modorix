import { LoginUserRequest, SignUpUserRequest, UserSession } from '@modorix/commons';
import { LoginGateway, SignUpGateway } from '../../domain/gateways/user-gateway';
import { isUserSession } from '../../domain/type-guards/user-session-guard';

const usersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/users`;

export const signUp: SignUpGateway = async ({
  email,
  password,
  confirmPassword,
}: SignUpUserRequest): Promise<void | { error: 'email-used' | 'unknown-error' }> => {
  const signUpResponse = await fetch(`${usersBaseUrl}/sign-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, confirmPassword }),
  });
  const signUpTextResponse = await signUpResponse.text();
  if (!signUpTextResponse) {
    return;
  }

  return handleSignUpError(signUpTextResponse);
};

async function handleSignUpError(signUpTextResponse: string): Promise<{ error: 'email-used' | 'unknown-error' }> {
  const signUpJsonResponse = JSON.parse(signUpTextResponse);
  const responseHasErrorMessage = typeof signUpJsonResponse === 'object' && 'message' in signUpJsonResponse;
  if (responseHasErrorMessage && signUpJsonResponse.message.match(/^Email .* is already used$/)) {
    return { error: 'email-used' };
  }
  return { error: 'unknown-error' };
}

export const login: LoginGateway = async ({
  email,
  password,
}: LoginUserRequest): Promise<UserSession | { error: 'invalid-credentials' | 'email-not-confirmed' | 'unknown-error' }> => {
  const loginJsonResponse = await (
    await fetch(`${usersBaseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  ).json();

  if (isUserSession(loginJsonResponse)) {
    return loginJsonResponse;
  }

  return handleLoginError(loginJsonResponse);
};

function handleLoginError(loginJsonResponse: unknown): { error: 'invalid-credentials' | 'email-not-confirmed' | 'unknown-error' } {
  const handledErrors = ['invalid_credentials', 'email_not_confirmed'];
  if (loginJsonResponseAsCode(loginJsonResponse) && handledErrors.includes(loginJsonResponse.message)) {
    return { error: loginJsonResponse.message.replace(/_/g, '-') as 'invalid-credentials' | 'email-not-confirmed' };
  }
  return { error: 'unknown-error' };
}

function loginJsonResponseAsCode(loginJsonResponse: unknown): loginJsonResponse is { message: string } {
  return (
    !!loginJsonResponse &&
    typeof loginJsonResponse === 'object' &&
    'message' in loginJsonResponse &&
    typeof loginJsonResponse.message === 'string'
  );
}
