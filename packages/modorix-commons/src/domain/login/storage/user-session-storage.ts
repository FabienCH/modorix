import { jwtDecode } from 'jwt-decode';
import { UserSession, UserSessionInfos } from '../models/user-session';

export enum StorageKey {
  AccessToken = 'access-token',
  RefreshToken = 'refresh-token',
  UserEmail = 'user-email',
  UserId = 'user-id',
}

export type GetStorageItem = (key: StorageKey) => Promise<string | null>;
export type SetStorageItem = (key: StorageKey, value: string) => Promise<void>;
export type RemoveStorageItem = (key: StorageKey) => Promise<void>;

type SaveUserSessionStorage = (userSession: UserSession, setItem: SetStorageItem) => void;
type RemoveUserSessionStorage = (removeItem: RemoveStorageItem) => void;
type GetAccessTokenStorage = (getItem: GetStorageItem) => Promise<string | null>;
type GetRefreshTokenStorage = (getItem: GetStorageItem) => Promise<string | null>;
type GetUserInfosStorage = (getItem: GetStorageItem) => Promise<UserSessionInfos | null>;

export interface UserSessionStorage {
  getItem: GetStorageItem;
  removeItem: RemoveStorageItem;
  setItem: SetStorageItem;
}

export const saveUserSessionInStorage: SaveUserSessionStorage = async (
  userSession: UserSession,
  setItem: SetStorageItem,
): Promise<void> => {
  await setItem(StorageKey.AccessToken, userSession.accessToken);
  await setItem(StorageKey.RefreshToken, userSession.refreshToken);
  await setItem(StorageKey.UserEmail, userSession.email);
  await setItem(StorageKey.UserId, userSession.userId);
};

export const removeUserSessionStorage: RemoveUserSessionStorage = async (removeItem: RemoveStorageItem): Promise<void> => {
  await removeItem(StorageKey.AccessToken);
  await removeItem(StorageKey.RefreshToken);
  await removeItem(StorageKey.UserEmail);
  await removeItem(StorageKey.UserId);
};

export const getAccessTokenFromStorage: GetAccessTokenStorage = async (getItem: GetStorageItem): Promise<string | null> => {
  return getItem(StorageKey.AccessToken);
};

export const getRefreshTokenFromStorage: GetRefreshTokenStorage = async (getItem: GetStorageItem): Promise<string | null> => {
  return getItem(StorageKey.RefreshToken);
};

export const getUserInfosFromStorage: GetUserInfosStorage = async (getItem: GetStorageItem): Promise<UserSessionInfos | null> => {
  const token = await getAccessTokenFromStorage(getItem);
  const decodedToken = token ? jwtDecode(token) : undefined;
  if (!decodedToken) {
    return null;
  }
  const hasValidAccessToken = decodedToken?.exp !== undefined && decodedToken.exp * 1000 > Date.now();

  const userEmail = await getItem(StorageKey.UserEmail);

  const userId = await getItem(StorageKey.UserId);

  if (!userEmail || !userId) {
    return null;
  }

  return { hasValidAccessToken, userEmail, userId };
};
