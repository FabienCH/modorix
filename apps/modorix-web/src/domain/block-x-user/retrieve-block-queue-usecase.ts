import { GetAccessTokenStorage, GetRefreshTokenStorage, SaveUserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueue(
  getBlockQueue: (
    getAccessToken: GetAccessTokenStorage<Promise<string | null> | string | null>,
    getRefreshToken: GetRefreshTokenStorage<Promise<string | null> | string | null>,
    saveUserSession: SaveUserSessionStorage,
  ) => Promise<XUser[] | { error: 'auth' | 'other' }>,
  setBlockQueue: (blockedUser: XUser[]) => void,
  getAccessToken: GetAccessTokenStorage<string | null>,
  getRefreshToken: GetRefreshTokenStorage<Promise<string | null> | string | null>,
  saveUserSession: SaveUserSessionStorage,
): Promise<void> {
  const blockQueueRes = await getBlockQueue(getAccessToken, getRefreshToken, saveUserSession);
  if ('error' in blockQueueRes) {
    console.log('blockQueueRes AUTH ERRORRR');
  } else {
    setBlockQueue(blockQueueRes);
  }
}
