import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';
import { OnErrorCallback } from '../model/on-error-callback';

export async function retrieveBlockedUsers(
  getBlockedUsers: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  onBlockedUsersRetrieved: (blockedUser: XUser[]) => void,
  onError: OnErrorCallback,
  {
    setUserSessionInfos,
    ...userSessionStorage
  }: UserSessionStorage & { setUserSessionInfos: (userSessionInfos: UserSessionInfos | null) => void },
): Promise<void> {
  const blockedUsersRes = await getBlockedUsers(userSessionStorage);
  if ('error' in blockedUsersRes) {
    onError("Couldn't retrieve your list of blocked X users", blockedUsersRes.error, setUserSessionInfos);
    onBlockedUsersRetrieved([]);
  } else {
    onBlockedUsersRetrieved(blockedUsersRes);
  }
}
