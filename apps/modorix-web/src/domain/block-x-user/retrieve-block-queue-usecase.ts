import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockQueue(
  getBlockQueue: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueue: (blockedUser: XUser[]) => void,
  onError: (title: string, error: AuthError['error']) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void> {
  const blockQueueRes = await getBlockQueue(userSessionStorage);
  if ('error' in blockQueueRes) {
    onError("Couldn't retrieve your block queue", blockQueueRes.error);
  } else {
    setBlockQueue(blockQueueRes);
  }
}
