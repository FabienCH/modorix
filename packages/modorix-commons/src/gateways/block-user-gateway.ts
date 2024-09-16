import { GetAccessTokenStorage } from '../domain/login/storage/user-session-storage';
import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { fetchWithAuth } from './fetch-with-auth';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(modorixUserId: string, getAccessToken: GetAccessTokenStorage): Promise<XUser[]> {
  return (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/${modorixUserId}`, getAccessToken, {
      method: 'GET',
    })
  ).json();
}

export async function getBlockQueue(modorixUserId: string, getAccessToken: GetAccessTokenStorage): Promise<XUser[]> {
  return (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/queue/${modorixUserId}`, getAccessToken, {
      method: 'GET',
    })
  ).json();
}
