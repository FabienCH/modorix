import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { fetchWithAuth } from './fetch-with-auth';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}

export async function getBlockQueue(modorixUserId: string): Promise<XUser[]> {
  return (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/queue/${modorixUserId}`, {
      method: 'GET',
    })
  ).json();
}
