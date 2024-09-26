import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';

export async function addXUserToQueue(
  xUser: XUser,
  addToBlockQueue: (xUserId: string, userSessionStorage: UserSessionStorage) => Promise<void | AuthError>,
  onUserAddedToQueue: () => void,
  onError: (title: string, error: AuthError['error'], setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void) => void,
  {
    userSessionStorage,
    setUserSessionInfos,
  }: { userSessionStorage: UserSessionStorage; setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void },
): Promise<void> {
  const addToBlockQueueRes = await addToBlockQueue(xUser.xId, userSessionStorage);
  if (addToBlockQueueRes && 'error' in addToBlockQueueRes) {
    onError(`Couldn't add ${xUser.xUsername} to block queue`, addToBlockQueueRes.error, setUserSessionInfos);
  } else {
    onUserAddedToQueue();
  }
}
