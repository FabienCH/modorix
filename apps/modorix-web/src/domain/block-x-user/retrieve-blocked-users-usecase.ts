import { GetAccessTokenStorage, GetRefreshTokenStorage, SaveUserSessionStorage, XUser } from '@modorix/commons';

export async function retrieveBlockedUsers(
  getBlockedUsers: (
    getAccessToken: GetAccessTokenStorage<Promise<string | null> | string | null>,
    getRefreshToken: GetRefreshTokenStorage<Promise<string | null> | string | null>,
    saveUserSession: SaveUserSessionStorage,
  ) => Promise<XUser[] | { error: 'auth' | 'other' }>,
  setBlockedUsers: (blockedUser: XUser[]) => void,
  getAccessToken: GetAccessTokenStorage<string | null>,
  getRefreshToken: GetRefreshTokenStorage<Promise<string | null> | string | null>,
  saveUserSession: SaveUserSessionStorage,
): Promise<void> {
  const blockedUsersRes = await getBlockedUsers(getAccessToken, getRefreshToken, saveUserSession);
  if ('error' in blockedUsersRes) {
    console.log('blockedUsersRes AUTH ERRORRR');
  } else {
    setBlockedUsers(blockedUsersRes);
  }
}
