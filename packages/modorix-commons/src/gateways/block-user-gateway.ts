import { XUser } from '../models/x-user';

const blockedXUsersBaseUrl = 'http://localhost:3000/api/block-x-users';

export async function getBlockedUsers(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl}/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}

export async function getBlockQueueCandidates(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetch(`${blockedXUsersBaseUrl}/queue/candidates/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}
