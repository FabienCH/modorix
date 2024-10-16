import {
  getAccessTokenFromStorage,
  getRefreshTokenFromStorage,
  GetStorageItem,
  removeUserSessionStorage,
  saveUserSessionInStorage,
  SetStorageItem,
  UserSessionStorage,
} from '../domain/login/storage/user-session-storage';
import { refreshAccessToken } from './http-user-gateway';

export interface AuthError {
  error: 'auth' | 'other';
}

export async function fetchWithAuth(
  input: string | URL | globalThis.Request,
  init: RequestInit,
  { removeItem, setItem, getItem }: UserSessionStorage,
): Promise<Response> {
  const response = await runFetchWithAuth(input, getItem, init);
  if (response.status === 401) {
    const { success } = await tryRefreshAccessToken(getItem, setItem);
    if (success) {
      return await runFetchWithAuth(input, getItem, init);
    }
    removeUserSessionStorage(removeItem);
    return response;
  }

  return response;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function mapResponseWithAuth(response: Response): Promise<any | AuthError> {
  if (!response.ok) {
    if (response.status === 401) {
      return { error: 'auth' };
    }
    return { error: 'other' };
  }
  try {
    return await response.json();
  } catch (_) {
    return;
  }
}

async function runFetchWithAuth(input: string | URL | globalThis.Request, getItem: GetStorageItem, init: RequestInit): Promise<Response> {
  const accessToken = await getAccessTokenFromStorage(getItem);
  if (!accessToken) {
    return Response.json({ statusCode: 401 }, { status: 401 });
  }
  return await fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${accessToken}` } });
}

async function tryRefreshAccessToken(getItem: GetStorageItem, setItem: SetStorageItem): Promise<{ success: boolean }> {
  const refreshToken = await getRefreshTokenFromStorage(getItem);
  if (!refreshToken) {
    return { success: false };
  }
  const userSession = await refreshAccessToken(refreshToken);
  if (userSession) {
    saveUserSessionInStorage(userSession, setItem);
  }
  return { success: !!userSession };
}
