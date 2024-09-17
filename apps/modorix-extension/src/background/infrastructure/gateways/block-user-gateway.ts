import { BlockXUserRequest } from '@modorix-commons/domain/models/x-user';
import { fetchWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { getAccessTokenFromBrowserStorage } from '../../../content/infrastructure/storage/browser-user-session-storage';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function saveBlockUser(xId: string, xUsername: string, blockReasonIds: string[]): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    xId,
    xUsername,
    blockedAt: new Date().toISOString(),
    blockReasonIds,
  };
  return fetchWithAuth(blockedXUsersBaseUrl, getAccessTokenFromBrowserStorage, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });
}

export async function updateBlockedUser(xUserId: string): Promise<Response> {
  return fetchWithAuth(`${blockedXUsersBaseUrl}/from-queue`, getAccessTokenFromBrowserStorage, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });
}
