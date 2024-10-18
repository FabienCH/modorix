import { Group, GroupDetails } from '@modorix-commons/domain/models/group';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { GatewayGroupDetails } from '@modorix-commons/gateways/gateway-group';
import { getAccessTokenFromStorage, GetStorageItem, UserSessionStorage } from '@modorix/commons';
import { mapToXUser } from '../../../../../packages/modorix-commons/src/gateways/block-user-gateway';

const groupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;
const publicGroupBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/public/groups`;

export async function getGroups(getItem: GetStorageItem): Promise<Group[]> {
  const headers = await getHeadersWithToken(getItem);
  return (await fetch(headers ? groupBaseUrl : publicGroupBaseUrl, { method: 'GET', headers })).json();
}

export async function getGroup(groupId: string, getItem: GetStorageItem): Promise<GroupDetails> {
  const headers = await getHeadersWithToken(getItem);
  const groupDetails = (await (
    await fetch(`${headers ? groupBaseUrl : publicGroupBaseUrl}/${groupId}`, { method: 'GET', headers })
  ).json()) as unknown as GatewayGroupDetails;

  return { ...groupDetails, blockedXUsers: groupDetails.blockedXUsers.map(mapToXUser) };
}

export async function joinGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(`${groupBaseUrl}/join/${groupId}`, { method: 'POST' }, userSessionStorage);

  return mapResponseWithAuth(response);
}

export async function leaveGroup(groupId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(`${groupBaseUrl}/leave/${groupId}`, { method: 'POST' }, userSessionStorage);

  return mapResponseWithAuth(response);
}

async function getHeadersWithToken(getItem: GetStorageItem): Promise<{ Authorization: string } | undefined> {
  const accessToken = await getAccessTokenFromStorage(getItem);
  return accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined;
}
