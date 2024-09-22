import { AuthError } from '@modorix-commons/gateways/fetch-with-auth';
import { UserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockedUsers(
  getBlockedUsers: (userSessionStorage: UserSessionStorage) => Promise<XUser[] | AuthError>,
  setBlockedUsers: (blockedUser: XUser[]) => void,
  userSessionStorage: UserSessionStorage,
): Promise<void> {
  const blockedUsersRes = await getBlockedUsers(userSessionStorage);
  if ('error' in blockedUsersRes) {
    console.log('blockedUsersRes AUTH ERRORRR');
  } else {
    setBlockedUsers(blockedUsersRes);
  }
}
