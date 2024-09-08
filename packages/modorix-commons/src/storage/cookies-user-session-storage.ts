import { UserSession } from '@modorix/commons';
import Cookies from 'js-cookie';

enum CookiesKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
}

export function saveUserSession(userSession: UserSession): void {
  Cookies.set(CookiesKey.AccessToken, userSession.accessToken, { secure: true, sameSite: 'strict' });
  Cookies.set(CookiesKey.RefreshToken, userSession.refreshToken, { secure: true, sameSite: 'strict' });
}

export function getAccessToken(): string {
  return Cookies.get(CookiesKey.AccessToken) ?? '';
}
