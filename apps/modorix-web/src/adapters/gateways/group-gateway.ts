import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage } from '@modorix/commons';

const groupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;

export async function getGroups(): Promise<Group[]> {
  return (await fetch(groupBaseUrl, { method: 'GET' })).json();
}

export async function getGroup(groupId: string): Promise<GroupDetails> {
  return (await fetch(`${groupBaseUrl}/${groupId}`, { method: 'GET' })).json();
}

export async function joinGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(
    `${groupBaseUrl}/join/${groupId}`,
    {
      method: 'POST',
    },
    userSessionStorage,
  );

  if (response.ok) {
    return;
  }

  return mapResponseWithAuth(await response.json());
}

export async function leaveGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(
    `${groupBaseUrl}/leave/${groupId}`,
    {
      method: 'POST',
    },
    userSessionStorage,
  );

  if (response.ok) {
    return;
  }

  return mapResponseWithAuth(await response.json());
}
