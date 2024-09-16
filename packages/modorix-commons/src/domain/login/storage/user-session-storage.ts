import { UserSession } from '../models/user-session';

export type SaveUserSessionStorage = (userSession: UserSession) => void;
export type GetAccessTokenStorage<T extends Promise<string> | string> = () => T;
export type GetUserEmailStorage<T extends Promise<string> | string> = () => T;
