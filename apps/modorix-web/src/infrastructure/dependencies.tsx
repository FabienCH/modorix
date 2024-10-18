import { GetStorageItem, RemoveStorageItem, SetStorageItem, StorageKey } from '@modorix/commons';
import Cookies from 'js-cookie';

const getItem: GetStorageItem = async (key: StorageKey) => Cookies.get(key) ?? null;
const setItem: SetStorageItem = async (key: StorageKey, value: string) => {
  Cookies.set(key, value);
};
const removeItem: RemoveStorageItem = async (key: StorageKey) => {
  Cookies.remove(key);
};

export const dependencies = {
  userSessionStorage: { getItem, setItem, removeItem },
};
