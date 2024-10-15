import { BlockEvent } from 'src/domain/models/block-event';
import { UserSessionStorage } from '../domain/login/storage/user-session-storage';
import { XUser } from '../domain/models/x-user';
import { getGatewayBaseUrl } from './base-url-config';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from './fetch-with-auth';

type GatewayBlockEvent = Omit<BlockEvent, 'blockedAt'> & { blockedAt: string };

const blockedXUsersBaseUrl = () => `${getGatewayBaseUrl()}/block-x-users`;

export async function getBlockedUsers(userSessionStorage: UserSessionStorage): Promise<XUser[] | AuthError> {
  const response = await fetchWithAuth(blockedXUsersBaseUrl(), { method: 'GET' }, userSessionStorage);

  return (await mapResponseWithAuth(response)).map(mapToXUser);
}

export async function getBlockQueue(userSessionStorage: UserSessionStorage): Promise<XUser[] | AuthError> {
  const response = await fetchWithAuth(`${blockedXUsersBaseUrl()}/queue`, { method: 'GET' }, userSessionStorage);

  return (await mapResponseWithAuth(response)).map(mapToXUser);
}

export function mapToXUser(xUser: Omit<XUser, 'blockEvents'> & { blockEvents: GatewayBlockEvent[] }): XUser {
  return {
    ...xUser,
    blockEvents: xUser.blockEvents.map((blockEvent) => ({ ...blockEvent, blockedAt: new Date(blockEvent.blockedAt) })),
  };
}
