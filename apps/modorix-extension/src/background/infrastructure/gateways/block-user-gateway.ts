import { BlockXUserRequest } from '@modorix-commons/domain/models/x-user';
import { fetchWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage } from '@modorix/commons';

const blockedXUsersBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-x-users`;

export async function saveBlockUser(
  xId: string,
  xUsername: string,
  blockReasonIds: string[],
  blockedInGroupsIds: string[],
  userSessionStorage: UserSessionStorage,
): Promise<Response> {
  const bodyData: BlockXUserRequest = {
    xId,
    xUsername,
    blockedAt: new Date().toISOString(),
    blockReasonIds,
    blockedInGroupsIds,
  };
  return fetchWithAuth(
    blockedXUsersBaseUrl,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyData),
    },
    userSessionStorage,
  );
}

export async function updateBlockedUser(xUserId: string, userSessionStorage: UserSessionStorage): Promise<Response> {
  return fetchWithAuth(
    `${blockedXUsersBaseUrl}/from-queue`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ xUserId }),
    },
    userSessionStorage,
  );
}
