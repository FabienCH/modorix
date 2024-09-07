import { UserSession } from '@modorix/commons';

export function isUserSession(response: unknown): response is UserSession {
  return !!response && typeof response === 'object' && 'accessToken' in response && 'refreshToken' in response;
}
