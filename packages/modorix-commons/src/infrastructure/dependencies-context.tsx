import { createContext, useContext } from 'react';
import { UserSession } from '../domain/login/models/user-session';
import { UserSessionStorage } from '../domain/login/storage/user-session-storage';

const defaultDependencies = {
  userSessionStorage: {
    getAccessToken: () => {
      throw new Error('Missing dependencies UserSessionStorage.getAccessToken');
    },
    getRefreshToken: () => {
      throw new Error('Missing dependencies UserSessionStorage.getRefreshToken');
    },
    saveUserSession: (_: UserSession | null) => {
      throw new Error('Missing dependencies UserSessionStorage.saveUserSession');
    },
    getUserInfos: () => {
      throw new Error('Missing dependencies UserSessionStorage.getUserInfos');
    },
  },
};

const DependenciesContext = createContext<{
  dependencies: { userSessionStorage: UserSessionStorage };
}>({ dependencies: defaultDependencies });

const useDependenciesContext = () => {
  return useContext(DependenciesContext);
};

export { DependenciesContext, useDependenciesContext };
