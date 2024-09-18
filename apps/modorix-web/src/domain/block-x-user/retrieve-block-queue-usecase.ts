import { GetAccessTokenStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueue(
  getBlockQueue: (
    getAccessToken: GetAccessTokenStorage<Promise<string | null> | string | null>,
  ) => Promise<XUser[] | { error: 'auth' | 'other' }>,
  setBlockQueue: (blockedUser: XUser[]) => void,
  getAccessToken: GetAccessTokenStorage<string | null>,
): Promise<void> {
  const blockQueueRes = await getBlockQueue(getAccessToken);
  if ('error' in blockQueueRes) {
    console.log('blockQueueRes AUTH ERRORRR');
  } else {
    setBlockQueue(blockQueueRes);
  }
}
