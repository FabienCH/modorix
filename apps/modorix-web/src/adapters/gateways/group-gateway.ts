import { Group } from '@modorix-commons/models/group';

export async function getGroups(): Promise<Group[]> {
  return (
    await fetch('http://localhost:3000/api/groups', {
      method: 'GET',
    })
  ).json();
}

export async function joinGroup(groupId: string): Promise<void> {
  await fetch(`http://localhost:3000/api/groups/join/${groupId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function leaveGroup(groupId: string): Promise<void> {
  await fetch(`http://localhost:3000/api/groups/leave/${groupId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });
}
