import { DependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { UserSessionStorage } from '@modorix/commons';
import { useState } from 'react';
import {
  getAccessTokenFromBrowserStorage,
  getRefreshTokenFromBrowserStorage,
  getUserInfosFromBrowserStorage,
  saveUserSessionInBrowserStorage,
} from '../../content/infrastructure/storage/browser-user-session-storage';

const defaultDependencies = {
  userSessionStorage: {
    getAccessToken: getAccessTokenFromBrowserStorage,
    getRefreshToken: getRefreshTokenFromBrowserStorage,
    saveUserSession: saveUserSessionInBrowserStorage,
    getUserInfos: getUserInfosFromBrowserStorage,
  },
};

const DependenciesProvider = ({ children }: { children: React.ReactNode }) => {
  const [dependencies] = useState<{ userSessionStorage: UserSessionStorage }>(defaultDependencies);

  return <DependenciesContext.Provider value={{ dependencies }}>{children}</DependenciesContext.Provider>;
};

export { DependenciesProvider };
