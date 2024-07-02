import { BlockXUserRequest } from '@modorix-commons/models/x-user';

export function saveBlockUser(xUserId: string, blockReasonIds: string[]): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    id: xUserId,
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
