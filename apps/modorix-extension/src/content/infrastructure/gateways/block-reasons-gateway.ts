import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { fetchWithAuth, mapResponseWithAuth } from '@modorix-commons/gateways/fetch-with-auth';
import {
  getAccessTokenFromBrowserStorage,
  getRefreshTokenFromBrowserStorage,
  saveUserSessionInBrowserStorage,
} from '../storage/browser-user-session-storage';

const blockReasonsBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-reasons`;

export async function getBlockReasons(): Promise<BlockReason[] | { error: 'auth' | 'other' }> {
  console.log('getBlockReasons');
  const response = await (
    await fetchWithAuth(
      blockReasonsBaseUrl,
      getAccessTokenFromBrowserStorage,
      getRefreshTokenFromBrowserStorage,
      saveUserSessionInBrowserStorage,
      {
        method: 'GET',
      },
    )
  )?.json();

  return mapResponseWithAuth(response);
}
