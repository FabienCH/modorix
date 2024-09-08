import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { fetchWithAuth } from '@modorix-commons/gateways/fetch-with-auth';

const groupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;

export async function getGroups(): Promise<Group[]> {
  return (await fetch(groupBaseUrl, { method: 'GET' })).json();
}

export async function getGroup(groupId: string): Promise<GroupDetails> {
  return (await fetch(`${groupBaseUrl}/${groupId}`, { method: 'GET' })).json();
}

export async function joinGroup(groupId: string): Promise<void> {
  await fetchWithAuth(`${groupBaseUrl}/join/${groupId}`, {
    method: 'POST',
  });
}

export async function leaveGroup(groupId: string): Promise<void> {
  await fetchWithAuth(`${groupBaseUrl}/leave/${groupId}`, {
    method: 'POST',
  });
}
