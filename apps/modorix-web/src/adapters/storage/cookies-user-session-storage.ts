import { GetAccessTokenStorage, GetUserEmailStorage, SaveUserSessionStorage, UserSession } from '@modorix/commons';
import Cookies from 'js-cookie';

enum CookiesKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  UserEmail = 'user-email',
}

export const saveUserSessionInCookies: SaveUserSessionStorage = (userSession: UserSession) => {
  Cookies.set(CookiesKey.AccessToken, userSession.accessToken, { secure: true, sameSite: 'strict' });
  Cookies.set(CookiesKey.RefreshToken, userSession.refreshToken, { secure: true, sameSite: 'strict' });
  Cookies.set(CookiesKey.UserEmail, userSession.email, { secure: true, sameSite: 'strict' });
};

export const getAccessTokenFromCookies: GetAccessTokenStorage<string> = () => {
  return Cookies.get(CookiesKey.AccessToken) ?? '';
};

export const getUserEmailFromCookies: GetUserEmailStorage<string> = () => {
  return Cookies.get(CookiesKey.UserEmail) ?? '';
};
