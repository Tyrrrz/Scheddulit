import { useEffect, useState } from 'react';

type StorageKind = 'local' | 'session';

const getStorage = (storageKind: StorageKind) => {
  switch (storageKind) {
    case 'local':
      return localStorage;
    case 'session':
      return sessionStorage;
  }
};

const getStorageValue = (storageKind: StorageKind, key: string) => {
  const item = getStorage(storageKind).getItem(key);

  if (typeof item !== 'undefined' && item !== null) {
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  return null;
};

const setStorageValue = (storageKind: StorageKind, key: string, value: any) => {
  getStorage(storageKind).setItem(key, JSON.stringify(value));
};

const usePersistedState = <T>(storageKind: StorageKind, key: string, initialState: T) => {
  const isClientSide = typeof window !== 'undefined';
  const [value, setValue] = useState<T>(() =>
    isClientSide ? getStorageValue(storageKind, key) ?? initialState : initialState
  );

  useEffect(() => {
    if (!isClientSide) {
      return;
    }

    setStorageValue(storageKind, key, value);
  }, [storageKind, key, isClientSide, value]);

  return [value, setValue] as const;
};

export default usePersistedState;
