import { UserSessionStorage } from '@modorix/commons';
import {
  getAccessTokenFromBrowserStorage,
  getRefreshTokenFromBrowserStorage,
  getUserInfosFromBrowserStorage,
  saveUserSessionInBrowserStorage,
} from './content/infrastructure/storage/browser-user-session-storage';

export const dependencies: { userSessionStorage: UserSessionStorage } = {
  userSessionStorage: {
    getAccessToken: getAccessTokenFromBrowserStorage,
    getRefreshToken: getRefreshTokenFromBrowserStorage,
    saveUserSession: saveUserSessionInBrowserStorage,
    getUserInfos: getUserInfosFromBrowserStorage,
  },
};
