import {
  GetAccessTokenStorage,
  GetRefreshTokenStorage,
  GetUserInfosStorage,
  SaveUserSessionStorage,
  UserSession,
  UserSessionInfos,
} from '@modorix/commons';
import { jwtDecode } from 'jwt-decode';

enum StorageKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  UserEmail = 'user-email',
  UserId = 'user-id',
}

export const saveUserSessionInBrowserStorage: SaveUserSessionStorage = (userSession: UserSession | null) => {
  if (!userSession) {
    chrome.storage.local.remove(StorageKey.AccessToken);
    chrome.storage.local.remove(StorageKey.RefreshToken);
    chrome.storage.local.remove(StorageKey.UserEmail);
    chrome.storage.local.remove(StorageKey.UserId);
  } else {
    chrome.storage.local.set({ [StorageKey.AccessToken]: userSession.accessToken });
    chrome.storage.local.set({ [StorageKey.RefreshToken]: userSession.refreshToken });
    chrome.storage.local.set({ [StorageKey.UserEmail]: userSession.email });
    chrome.storage.local.set({ [StorageKey.UserId]: userSession.userId });
  }
};

export const getAccessTokenFromBrowserStorage: GetAccessTokenStorage<Promise<string | null>> = async () => {
  const storageValue = await chrome.storage.local.get(StorageKey.AccessToken);
  return storageValue[StorageKey.AccessToken] ?? null;
};

export const getRefreshTokenFromBrowserStorage: GetRefreshTokenStorage<Promise<string | null>> = async () => {
  const storageValue = await chrome.storage.local.get(StorageKey.RefreshToken);
  return storageValue[StorageKey.RefreshToken] ?? null;
};

export const getUserInfosFromBrowserStorage: GetUserInfosStorage<Promise<UserSessionInfos | null>> = async () => {
  const token = await getAccessTokenFromBrowserStorage();
  const decodedToken = token ? jwtDecode(token) : undefined;
  if (!decodedToken) {
    return null;
  }
  const hasValidAccessToken = decodedToken?.exp !== undefined && decodedToken.exp * 1000 > Date.now();

  const emailStorageValue = await chrome.storage.local.get(StorageKey.UserEmail);
  const userEmail = emailStorageValue[StorageKey.UserEmail];

  const userIdStorageValue = await chrome.storage.local.get(StorageKey.UserId);
  const userId = userIdStorageValue[StorageKey.UserId];

  if (!userEmail || !userId) {
    return null;
  }

  return { hasValidAccessToken, userEmail, userId };
};
