import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { GetAccessTokenStorage, UserSessionStorage } from '@modorix/commons';

const groupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;
const publicGroupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/public/groups`;

export async function getGroups(getAccessToken: GetAccessTokenStorage): Promise<Group[]> {
  const headers = await getHeadersWithToken(getAccessToken);
  return (await fetch(headers ? groupBaseUrl : publicGroupBaseUrl, { method: 'GET', headers })).json();
}

export async function getGroup(groupId: string, getAccessToken: GetAccessTokenStorage): Promise<GroupDetails> {
  const headers = await getHeadersWithToken(getAccessToken);
  return (await fetch(`${headers ? groupBaseUrl : publicGroupBaseUrl}/${groupId}`, { method: 'GET', headers })).json();
}

export async function joinGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(`${groupBaseUrl}/join/${groupId}`, { method: 'POST' }, userSessionStorage);

  return mapResponseWithAuth(response);
}

export async function leaveGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(`${groupBaseUrl}/leave/${groupId}`, { method: 'POST' }, userSessionStorage);

  return mapResponseWithAuth(response);
}

async function getHeadersWithToken(getAccessToken: GetAccessTokenStorage): Promise<{ Authorization: string } | undefined> {
  const tokenFromStorage = getAccessToken();
  const accessToken = typeof tokenFromStorage === 'string' ? tokenFromStorage : await tokenFromStorage;
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}
