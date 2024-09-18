import { GetAccessTokenStorage } from '../domain/login/storage/user-session-storage';
import { getRefreshToken } from '../storage/cookies-user-session-storage';
import { refreshAccessToken } from './http-user-gateway';

export async function fetchWithAuth(
  input: string | URL | globalThis.Request,
  getAccessToken: GetAccessTokenStorage,
  init: RequestInit,
): Promise<Response> {
  const response = await runFetchWithAuth(input, getAccessToken, init);
  if (response.status === 401) {
    const { success } = await tryRefreshAccessToken();
    if (success) {
      return await runFetchWithAuth(input, getAccessToken, init);
    }
    return response;
  }

  return response;
}

async function runFetchWithAuth(
  input: string | URL | globalThis.Request,
  getAccessToken: GetAccessTokenStorage<Promise<string | null> | string | null>,
  init: RequestInit,
): Promise<Response> {
  const accessTokenFromStorage = getAccessToken();
  const accessToken = typeof accessTokenFromStorage === 'string' ? accessTokenFromStorage : await accessTokenFromStorage;
  if (!accessToken) {
    return new Response(null, { status: 401 });
  }
  return await fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` } });
}

async function tryRefreshAccessToken(): Promise<{ success: boolean }> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return { success: false };
  }
  const userSession = await refreshAccessToken(refreshToken);
  return { success: !!userSession };
}
