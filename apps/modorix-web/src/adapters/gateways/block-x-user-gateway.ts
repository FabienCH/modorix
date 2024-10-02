import { XUser } from '@modorix-commons/domain/models/x-user';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage } from '@modorix/commons';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function getBlockQueueCandidates(userSessionStorage: UserSessionStorage): Promise<XUser[] | AuthError> {
  const response = await fetchWithAuth(`${blockedXUsersBaseUrl}/queue/candidates`, { method: 'GET' }, userSessionStorage);

  return mapResponseWithAuth(response);
}

export async function addToBlockQueue(xUserId: string, userSessionStorage: UserSessionStorage): Promise<void | AuthError> {
  const response = await fetchWithAuth(
    `${blockedXUsersBaseUrl}/queue`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xUserId }),
    },
    userSessionStorage,
  );

  return mapResponseWithAuth(response);
}
