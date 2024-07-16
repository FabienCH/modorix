import { BlockXUserRequest } from '@modorix-commons/models/x-user';

export function saveBlockUser(xId: number, xUsername: string, blockReasonIds: string[]): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    xId,
    xUsername,
    blockedAt: new Date().toISOString(),
    blockReasonIds,
    blockingModorixUserId: '1',
  };
  return fetch('http://localhost:3000/api/block-x-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });
}
