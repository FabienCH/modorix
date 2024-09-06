import { BlockXUserRequest } from '@modorix-commons/domain/models/x-user';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function saveBlockUser(xId: string, xUsername: string, blockReasonIds: string[]): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    xId,
    xUsername,
    blockedAt: new Date().toISOString(),
    blockReasonIds,
    blockingModorixUserId: '1',
  };
  return fetch(blockedXUsersBaseUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });
}

export async function updateBlockedUser(xUserId: string): Promise<Response> {
  return fetch(`${blockedXUsersBaseUrl}/from-queue/1`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });
}
