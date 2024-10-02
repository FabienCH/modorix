import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';
import { OnErrorCallback } from '../model/on-error-callback';

export async function retrieveBlockQueue(
  getBlockQueue: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockQueue: (blockedUser: XUser[]) => void,
  onError: OnErrorCallback,
  {
    setUserSessionInfos,
    ...userSessionStorage
  }: UserSessionStorage & { setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void },
): Promise<void> {
  const blockQueueRes = await getBlockQueue(userSessionStorage);
  if ('error' in blockQueueRes) {
    onError("Couldn't retrieve your block queue", blockQueueRes.error, setUserSessionInfos);
    setBlockQueue([]);
  } else {
    setBlockQueue(blockQueueRes);
  }
}
