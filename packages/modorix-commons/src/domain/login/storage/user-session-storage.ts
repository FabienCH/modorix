import { UserSession, UserSessionInfos } from '../models/user-session';

export type SaveUserSessionStorage = (userSession: UserSession) => void;
export type GetAccessTokenStorage<T extends Promise<string | null> | string | null = Promise<string | null> | string | null> = () => T;
export type GetRefreshTokenStorage<T extends Promise<string | null> | string | null = Promise<string | null> | string | null> = () => T;
export type GetUserInfosStorage<T extends Promise<UserSessionInfos> | UserSessionInfos> = () => T;

export interface UserSessionStorage {
  getAccessToken: GetAccessTokenStorage;
  getRefreshToken: GetRefreshTokenStorage;
  saveUserSession: SaveUserSessionStorage;
  getUserInfos: GetUserInfosStorage<Promise<UserSessionInfos> | UserSessionInfos>;
}
