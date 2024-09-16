import { GetAccessTokenStorage, GetUserEmailStorage, SaveUserSessionStorage, UserSession } from '@modorix/commons';

enum StorageKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  UserEmail = 'user-email',
}

export const saveUserSessionInBrowserStorage: SaveUserSessionStorage = (userSession: UserSession) => {
  chrome.storage.local.set({ [StorageKey.AccessToken]: userSession.accessToken });
  chrome.storage.local.set({ [StorageKey.RefreshToken]: userSession.refreshToken });
  chrome.storage.local.set({ [StorageKey.UserEmail]: userSession.email });
};

export const getAccessTokenFromBrowserStorage: GetAccessTokenStorage<Promise<string>> = async () => {
  const storageValue = await chrome.storage.local.get(StorageKey.AccessToken);
  return storageValue[StorageKey.AccessToken] ?? '';
};

export const getUserEmailFromBrowserStorage: GetUserEmailStorage<Promise<string>> = async () => {
  const storageValue = await chrome.storage.local.get(StorageKey.UserEmail);
  return storageValue[StorageKey.UserEmail] ?? '';
};
