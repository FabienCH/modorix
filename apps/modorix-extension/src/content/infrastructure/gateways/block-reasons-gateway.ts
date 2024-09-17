import { fetchWithAuth } from '@modorix-commons//gateways/fetch-with-auth';
import { BlockReason } from '@modorix-commons/domain/models/block-reason';
import { getAccessTokenFromBrowserStorage } from '../storage/browser-user-session-storage';

const blockReasonsBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-reasons`;

export async function getBlockReasons(): Promise<BlockReason[]> {
  return (
    await fetchWithAuth(blockReasonsBaseUrl, getAccessTokenFromBrowserStorage, {
      method: 'GET',
    })
  ).json();
}
