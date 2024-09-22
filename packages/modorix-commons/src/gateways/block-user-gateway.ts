import { UserSessionStorage } from '../domain/login/storage/user-session-storage';
import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from './fetch-with-auth';

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(userSessionStorage: UserSessionStorage): Promise<XUser[] | AuthError> {
  const response = await (
    await fetchWithAuth(
      blockedXUsersBaseUrl(),
      {
        method: 'GET',
      },
      userSessionStorage,
    )
  ).json();

  return mapResponseWithAuth(response);
}

export async function getBlockQueue(userSessionStorage: UserSessionStorage): Promise<XUser[] | AuthError> {
  const response = await (
    await fetchWithAuth(
      `${blockedXUsersBaseUrl()}/queue`,
      {
        method: 'GET',
      },
      userSessionStorage,
    )
  ).json();

  return mapResponseWithAuth(response);
}
