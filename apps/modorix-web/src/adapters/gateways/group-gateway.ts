import { Group, GroupDetails } from '@modorix-commons/models/group';

const groupBaseUrl = 'http://localhost:3000/api/groups';

export async function getGroups(): Promise<Group[]> {
  return (await fetch(groupBaseUrl, { method: 'GET' })).json();
}

export async function getGroup(groupId: string): Promise<GroupDetails> {
  return (await fetch(`${groupBaseUrl}/${groupId}`, { method: 'GET' })).json();
}

export async function joinGroup(groupId: string): Promise<void> {
  await fetch(`${groupBaseUrl}/join/${groupId}`, {
    method: 'POST',
  });
}

export async function leaveGroup(groupId: string): Promise<void> {
  await fetch(`${groupBaseUrl}/leave/${groupId}`, {
    method: 'POST',
  });
}
