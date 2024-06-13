import { BlockXUserRequest } from '@modorix-commons/models/x-user';

export function saveBlockUser(userId: string, blockReasonIds: string[]): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    id: userId,
    blockedAt: new Date().toISOString(),
    blockReasonIds,
  };
  return fetch('http://localhost:3000/api/block-users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bodyData),
  });
}
