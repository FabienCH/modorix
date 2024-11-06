import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { Group, UserSessionStorage } from '@modorix/commons';

const groupsBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/groups`;

export async function getJoinedGroups(userSessionStorage: UserSessionStorage): Promise<Group[] | AuthError> {
  const response = await fetchWithAuth(`${groupsBaseUrl}/joined`, { method: 'GET' }, userSessionStorage);

  return mapResponseWithAuth(response);
}
