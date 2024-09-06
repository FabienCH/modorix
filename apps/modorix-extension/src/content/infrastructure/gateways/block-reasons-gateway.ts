import { BlockReason } from '@modorix-commons/domain/models/block-reason';

const blockReasonsBaseUrl = `${import.meta.env.VITE_API_BASE_URL}/block-reasons`;

export async function getBlockReasons(): Promise<BlockReason[]> {
  return (
    await fetch(blockReasonsBaseUrl, {
      method: 'GET',
    })
  ).json();
}
