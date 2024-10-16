import { DependenciesContext } from '@modorix-commons/infrastructure/dependencies-context';
import { GetStorageItem, RemoveStorageItem, SetStorageItem, StorageKey, UserSessionStorage } from '@modorix/commons';
import Cookies from 'js-cookie';
import { useState } from 'react';

const getItem: GetStorageItem = async (key: StorageKey) => Cookies.get(key) ?? null;
const setItem: SetStorageItem = async (key: StorageKey, value: string) => {
  Cookies.set(key, value);
};
const removeItem: RemoveStorageItem = async (key: StorageKey) => {
  Cookies.remove(key);
};

const defaultDependencies = {
  userSessionStorage: { getItem, setItem, removeItem },
};

const DependenciesProvider = ({ children }: { children: React.ReactNode }) => {
  const [dependencies] = useState<{ userSessionStorage: UserSessionStorage }>(defaultDependencies);

  return <DependenciesContext.Provider value={{ dependencies }}>{children}</DependenciesContext.Provider>;
};

export { DependenciesProvider };
