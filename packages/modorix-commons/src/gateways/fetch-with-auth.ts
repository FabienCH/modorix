import {
  GetAccessTokenStorage,
  GetRefreshTokenStorage,
  SaveUserSessionStorage,
  UserSessionStorage,
} from '../domain/login/storage/user-session-storage';
import { refreshAccessToken } from './http-user-gateway';

export interface AuthError {
  error: 'auth' | 'other';
}

export async function fetchWithAuth(
  input: string | URL | globalThis.Request,
  init: RequestInit,
  { getAccessToken, getRefreshToken, saveUserSession }: UserSessionStorage,
): Promise<Response> {
  const response = await runFetchWithAuth(input, getAccessToken, init);
  if (response.status === 401) {
    const { success } = await tryRefreshAccessToken(getRefreshToken, saveUserSession);
    if (success) {
      return await runFetchWithAuth(input, getAccessToken, init);
    }
    return response;
  }

  return response;
}

export function mapResponseWithAuth<T extends object>(response: T | { statusCode: number }): T | AuthError {
  if ('statusCode' in response) {
    if (response.statusCode === 401) {
      return { error: 'auth' };
    }
    return { error: 'other' };
  }
  return response;
}

async function runFetchWithAuth(
  input: string | URL | globalThis.Request,
  getAccessToken: GetAccessTokenStorage,
  init: RequestInit,
): Promise<Response> {
  const accessToken = await getTokenFromStorage(getAccessToken);
  if (!accessToken) {
    return Response.json({ statusCode: 401 });
  }
  return await fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` } });
}

async function tryRefreshAccessToken(
  getRefreshToken: GetRefreshTokenStorage,
  saveUserSession: SaveUserSessionStorage,
): Promise<{ success: boolean }> {
  const refreshToken = await getTokenFromStorage(getRefreshToken);
  if (!refreshToken) {
    return { success: false };
  }
  const userSession = await refreshAccessToken(refreshToken);
  if (userSession) {
    saveUserSession(userSession);
  }
  return { success: !!userSession };
}

async function getTokenFromStorage(getToken: GetAccessTokenStorage | GetRefreshTokenStorage): Promise<string | null> {
  const tokenFromStorage = getToken();
  return typeof tokenFromStorage === 'string' ? tokenFromStorage : await tokenFromStorage;
}
