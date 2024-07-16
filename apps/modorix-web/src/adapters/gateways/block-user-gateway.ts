import { XUser } from '@modorix-commons/models/x-user';

const blockedXUsersBaseUrl = 'http://localhost:3000/api/block-x-users';

export async function getBlockQueueCandidates(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl}/queue/candidates/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}

export function addToBlockQueue(modorixUserId: string, xUserId: number): Promise<Response> {
  return fetch(`${blockedXUsersBaseUrl}/queue/${modorixUserId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });
}
