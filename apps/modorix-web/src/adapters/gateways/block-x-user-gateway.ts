import { XUser } from '@modorix-commons/models/x-user';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function getBlockQueueCandidates(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl}/queue/candidates/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}

export function addToBlockQueue(modorixUserId: string, xUserId: string): Promise<Response> {
  return fetch(`${blockedXUsersBaseUrl}/queue/${modorixUserId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ xUserId }),
  });
}
