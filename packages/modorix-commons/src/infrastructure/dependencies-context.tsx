import { createContext, useContext } from 'react';
import { StorageKey, UserSessionStorage } from '../domain/login/storage/user-session-storage';

const defaultDependencies = {
  userSessionStorage: {
    getItem: (_: StorageKey) => {
      throw new Error('Missing dependencies UserSessionStorage.getItem');
    },
    setItem: (_: StorageKey, __: string) => {
      throw new Error('Missing dependencies UserSessionStorage.setItem');
    },
    removeItem: (_: StorageKey) => {
      throw new Error('Missing dependencies UserSessionStorage.removeItem');
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
