import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionInfos, UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockedUsers(
  getBlockedUsers: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  onBlockedUsersRetrieved: (blockedUser: XUser[]) => void,
  onError: (title: string, error: AuthError['error'], setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void) => void,
  {
    setUserSessionInfos,
    ...userSessionStorage
  }: UserSessionStorage & { setUserSessionInfos: (userSessionInfos: UserSessionInfos) => void },
): Promise<void> {
  const blockedUsersRes = await getBlockedUsers(userSessionStorage);
  if ('error' in blockedUsersRes) {
    onError("Couldn't retrieve your list of blocked X users", blockedUsersRes.error, setUserSessionInfos);
  } else {
    onBlockedUsersRetrieved(blockedUsersRes);
  }
}
