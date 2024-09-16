import { UserSession, UserSessionInfos } from '../models/user-session';

export type SaveUserSessionStorage = (userSession: UserSession) => void;
export type GetAccessTokenStorage<T extends Promise<string | null> | string | null> = () => T;
export type GetUserInfosStorage<T extends Promise<UserSessionInfos> | UserSessionInfos> = () => T;
