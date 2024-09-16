import { LoginUserRequest, UserSession } from '@modorix/commons';
import { LoginGateway } from '../domain/login/gateways/user-gateway';
import { isUserSession } from '../domain/login/type-guards/user-session-guard';
import { getGatewayBaseUrl } from './base-url-config';

const usersBaseUrl = () => `${getGatewayBaseUrl()}/users`;

export const login: LoginGateway = async ({
  email,
  password,
}: LoginUserRequest): Promise<UserSession | { error: 'invalid-credentials' | 'email-not-confirmed' | 'unknown-error' }> => {
  const loginJsonResponse = await (
    await fetch(`${usersBaseUrl()}/login`, {
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
