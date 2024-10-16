import { GetStorageItem, RemoveStorageItem, SetStorageItem, StorageKey, UserSessionStorage } from '@modorix/commons';

const getItem: GetStorageItem = async (key: StorageKey) => {
  const storageValue = await chrome.storage.local.get(key);
  return storageValue[key] ?? null;
};
const setItem: SetStorageItem = async (key: StorageKey, value: string) => {
  chrome.storage.local.set({ [key]: value });
};
const removeItem: RemoveStorageItem = chrome.storage.local.remove;

export const dependencies: { userSessionStorage: UserSessionStorage } = {
  userSessionStorage: { getItem, setItem, removeItem },
};
