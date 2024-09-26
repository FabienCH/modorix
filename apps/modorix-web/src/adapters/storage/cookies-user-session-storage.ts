import {
  GetAccessTokenStorage,
  GetRefreshTokenStorage,
  GetUserInfosStorage,
  SaveUserSessionStorage,
  UserSession,
  UserSessionInfos,
} from '@modorix/commons';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

enum CookiesKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  UserEmail = 'user-email',
}

export const saveUserSessionInCookies: SaveUserSessionStorage = (userSession: UserSession | null) => {
  if (!userSession) {
    Cookies.remove(CookiesKey.AccessToken);
    Cookies.remove(CookiesKey.RefreshToken);
    Cookies.remove(CookiesKey.UserEmail);
  } else {
    Cookies.set(CookiesKey.AccessToken, userSession.accessToken, { secure: true, sameSite: 'strict' });
    Cookies.set(CookiesKey.RefreshToken, userSession.refreshToken, { secure: true, sameSite: 'strict' });
    Cookies.set(CookiesKey.UserEmail, userSession.email, { secure: true, sameSite: 'strict' });
  }
};

export const getAccessTokenFromCookies: GetAccessTokenStorage<string | null> = () => {
  return Cookies.get(CookiesKey.AccessToken) ?? null;
};

export const getRefreshTokenFromCookies: GetRefreshTokenStorage<string | null> = () => {
  return Cookies.get(CookiesKey.RefreshToken) ?? null;
};

export const getUserInfosFromCookies: GetUserInfosStorage<UserSessionInfos> = () => {
  const token = getAccessTokenFromCookies();
  const decodedToken = token ? jwtDecode(token) : undefined;
  const hasValidAccessToken = decodedToken?.exp !== undefined && decodedToken.exp * 1000 > Date.now();
  return { hasValidAccessToken, userEmail: Cookies.get(CookiesKey.UserEmail) ?? null };
};
