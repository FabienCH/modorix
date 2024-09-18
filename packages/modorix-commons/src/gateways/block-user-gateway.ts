import { GetAccessTokenStorage } from '../domain/login/storage/user-session-storage';
import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { fetchWithAuth, mapResponseWithAuth } from './fetch-with-auth';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(getAccessToken: GetAccessTokenStorage): Promise<XUser[]> {
  const response = await (
    await fetchWithAuth(blockedXUsersBaseUrl(), getAccessToken, {
      method: 'GET',
    })
  ).json();

  return mapResponseWithAuth(response);
}

export async function getBlockQueue(getAccessToken: GetAccessTokenStorage): Promise<XUser[]> {
  const response = await (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/queue`, getAccessToken, {
      method: 'GET',
    })
  ).json();

  return mapResponseWithAuth(response);
}
