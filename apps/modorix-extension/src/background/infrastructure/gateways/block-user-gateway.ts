import { BlockXUserRequest } from '@modorix-commons/models/x-user';

const blockedXUsersBaseUrl = 'http://localhost:3000/api/block-x-users';

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
