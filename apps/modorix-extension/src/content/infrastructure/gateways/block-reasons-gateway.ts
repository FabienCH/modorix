import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { AuthError, fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage } from '@modorix/commons';

const blockReasonsBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-reasons`;

export async function getBlockReasons(userSessionStorage: UserSessionStorage): Promise<BlockReason[] | AuthError> {
  const response = await (await fetchWithAuth(blockReasonsBaseUrl, { method: 'GET' }, userSessionStorage))?.json();

  return mapResponseWithAuth(response);
}
