import { XUser } from '@modorix-commons/domain/models/x-user';
import { fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { getAccessTokenFromCookies, getRefreshTokenFromCookies, saveUserSessionInCookies } from '../storage/cookies-user-session-storage';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function getBlockQueueCandidates(): Promise<XUser[] | { error: 'auth' | 'other' }> {
  const response = await (
    await fetchWithAuth(
      `${blockedXUsersBaseUrl}/queue/candidates`,
      getAccessTokenFromCookies,
      getRefreshTokenFromCookies,
      saveUserSessionInCookies,
      {
        method: 'GET',
      },
    )
  )?.json();

  return mapResponseWithAuth(response);
}

export async function addToBlockQueue(xUserId: string): Promise<void | { error: 'auth' | 'other' }> {
  const response = await fetchWithAuth(
    `${blockedXUsersBaseUrl}/queue`,
    getAccessTokenFromCookies,
    getRefreshTokenFromCookies,
    saveUserSessionInCookies,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xUserId }),
    },
  );

  const textResponse = await response.text();
  if (!textResponse) {
    return;
  }

  return mapResponseWithAuth(JSON.parse(textResponse));
}
