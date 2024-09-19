import { GetAccessTokenStorage, GetRefreshTokenStorage, SaveUserSessionStorage } from '../domain/login/storage/user-session-storage';
import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { fetchWithAuth, mapResponseWithAuth } from './fetch-with-auth';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(
  getAccessToken: GetAccessTokenStorage,
  getRefreshToken: GetRefreshTokenStorage,
  saveUserSession: SaveUserSessionStorage,
): Promise<XUser[]> {
  const response = await (
    await fetchWithAuth(blockedXUsersBaseUrl(), getAccessToken, getRefreshToken, saveUserSession, {
      method: 'GET',
    })
  ).json();

  return mapResponseWithAuth(response);
}

export async function getBlockQueue(
  getAccessToken: GetAccessTokenStorage,
  getRefreshToken: GetRefreshTokenStorage,
  saveUserSession: SaveUserSessionStorage,
): Promise<XUser[] | { error: 'auth' | 'other' }> {
  const response = await (
    await fetchWithAuth(`${blockedXUsersBaseUrl()}/queue`, getAccessToken, getRefreshToken, saveUserSession, {
      method: 'GET',
    })
  ).json();

  return mapResponseWithAuth(response);
}
