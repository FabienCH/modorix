import { getAccessToken } from '../storage/cookies-user-session-storage';

export function fetchWithAuth(input: string | URL | globalThis.Request, init?: RequestInit) {
  return fetch(input, { ...init, headers: { ...init?.headers, Authorization: `Bearer ${getAccessToken()}` } });
}
