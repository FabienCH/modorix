import { BlockReason } from '@modorix-commons/models/block-reason';

export async function getBlockReasons(): Promise<BlockReason[]> {
  return (
    await fetch('http://localhost:3000/api/block-reasons', {
      method: 'GET',
    })
  ).json();
}
