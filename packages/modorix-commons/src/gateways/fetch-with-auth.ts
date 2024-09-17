import { GetAccessTokenStorage } from '../domain/login/storage/user-session-storage';

export async function fetchWithAuth(input: string | URL | globalThis.Request, getAccessToken: GetAccessTokenStorage, init?: RequestInit) {
  const accessTokenFromStorage = getAccessToken();
  const accessToken = typeof accessTokenFromStorage === 'string' ? accessTokenFromStorage : await accessTokenFromStorage;
  return fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` } });
}
