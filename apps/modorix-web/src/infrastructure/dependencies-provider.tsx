import { DependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { UserSessionStorage } from '@modorix/commons';
import { useState } from 'react';
import {
  getAccessTokenFromCookies,
  getRefreshTokenFromCookies,
  getUserInfosFromCookies,
  saveUserSessionInCookies,
} from '../adapters/storage/cookies-user-session-storage';

const defaultDependencies = {
  userSessionStorage: {
    getAccessToken: getAccessTokenFromCookies,
    getRefreshToken: getRefreshTokenFromCookies,
    saveUserSession: saveUserSessionInCookies,
    getUserInfos: getUserInfosFromCookies,
  },
};

const DependenciesProvider = ({ children }: { children: React.ReactNode }) => {
  const [dependencies] = useState<{ userSessionStorage: UserSessionStorage }>(defaultDependencies);

  return <DependenciesContext.Provider value={{ dependencies }}>{children}</DependenciesContext.Provider>;
};

export { DependenciesProvider };
