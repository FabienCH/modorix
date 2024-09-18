import { GetAccessTokenStorage, XUser } from '@modorix/commons';

export async function retrieveBlockedUsers(
  getBlockedUsers: (
    getAccessToken: GetAccessTokenStorage<Promise<string | null> | string | null>,
  ) => Promise<XUser[] | { error: 'auth' | 'other' }>,
  setBlockedUsers: (blockedUser: XUser[]) => void,
  getAccessToken: GetAccessTokenStorage<string | null>,
): Promise<void> {
  const blockedUsersRes = await getBlockedUsers(getAccessToken);
  if ('error' in blockedUsersRes) {
    console.log('blockedUsersRes AUTH ERRORRR');
  } else {
    setBlockedUsers(blockedUsersRes);
  }
}
