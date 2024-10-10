import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';
import { OnErrorCallback } from '../model/on-error-callback';

export async function addXUserToQueue(
  xUser: XUser,
  addToBlockQueue: (xUserId: string, userSessionStorage: UserSessionStorage) => Promise<void | AuthError>,
  onUserAddedToQueue: () => void,
  onError: OnErrorCallback,
  {
    userSessionStorage,
    setUserSessionInfos,
  }: { userSessionStorage: UserSessionStorage; setUserSessionInfos: (userSessionInfos: UserSessionInfos | null) => void },
): Promise<void> {
  const addToBlockQueueRes = await addToBlockQueue(xUser.xId, userSessionStorage);
  if (addToBlockQueueRes && 'error' in addToBlockQueueRes) {
    onError(`Couldn't add ${xUser.xUsername} to block queue`, addToBlockQueueRes.error, setUserSessionInfos);
  } else {
    onUserAddedToQueue();
  }
}
