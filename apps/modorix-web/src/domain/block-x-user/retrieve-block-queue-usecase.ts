import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueue(
  getBlockQueue: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueue: (blockedUser: XUser[]) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void> {
  const blockQueueRes = await getBlockQueue(userSessionStorage);
  if ('error' in blockQueueRes) {
    console.log('blockQueueRes AUTH ERRORRR');
  } else {
    setBlockQueue(blockQueueRes);
  }
}
