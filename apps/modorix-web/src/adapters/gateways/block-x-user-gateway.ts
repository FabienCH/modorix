import { XUser } from '@modorix-commons/domain/models/x-user';
import { fetchWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { getAccessTokenFromCookies } from '../storage/cookies-user-session-storage';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function getBlockQueueCandidates(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetchWithAuth(`${blockedXUsersBaseUrl}/queue/candidates/${modorixUserId}`, getAccessTokenFromCookies, {
      method: 'GET',
    })
  ).json();
}

export function addToBlockQueue(modorixUserId: string, xUserId: string): Promise<Response> {
  return fetchWithAuth(`${blockedXUsersBaseUrl}/queue/${modorixUserId}`, getAccessTokenFromCookies, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });
}
