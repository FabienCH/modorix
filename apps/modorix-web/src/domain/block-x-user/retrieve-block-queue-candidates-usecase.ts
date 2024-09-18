import { XUser } from '@modorix/commons';

export async function retrieveBlockQueueCandidates(
  getBlockQueueCandidates: () => Promise<XUser[] | { error: 'auth' | 'other' }>,
  setBlockQueueCandidates: (blockedUser: XUser[]) => void,
): Promise<void> {
  const blockQueueCandidatesRes = await getBlockQueueCandidates();
  if ('error' in blockQueueCandidatesRes) {
    console.log('blockQueueCandidatesRes AUTH ERRORRR');
  } else {
    setBlockQueueCandidates(blockQueueCandidatesRes);
  }
}
