import { XUser } from '@modorix-commons/domain/models/x-user';
import { fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { getAccessTokenFromCookies } from '../storage/cookies-user-session-storage';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function getBlockQueueCandidates(): Promise<XUser[] | { error: 'auth' | 'other' }> {
  const response = await (
    await fetchWithAuth(`${blockedXUsersBaseUrl}/queue/candidates`, getAccessTokenFromCookies, {
      method: 'GET',
    })
  )?.json();

  return mapResponseWithAuth(response);
}

export async function addToBlockQueue(xUserId: string): Promise<Response | { error: 'auth' | 'other' }> {
  const response = await fetchWithAuth(`${blockedXUsersBaseUrl}/queue`, getAccessTokenFromCookies, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });

  const textResponse = await response.text();
  if (!textResponse) {
    response;
  }

  return mapResponseWithAuth(JSON.parse(textResponse));
}
