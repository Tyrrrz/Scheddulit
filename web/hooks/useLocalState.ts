import { useEffect, useState } from 'react';

const getStorageValue = (key: string) => {
  const item = localStorage.getItem(key);

  if (typeof item !== 'undefined' && item !== null) {
    try {
      return JSON.parse(item);
    } catch {
      return null;
    }
  }

  return null;
};

const setStorageValue = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const useLocalState = <T>(key: string, initialState: T) => {
  const isClientSide = typeof window !== 'undefined';
  const [value, setValue] = useState<T>(() =>
    isClientSide ? getStorageValue(key) ?? initialState : initialState
  );

  useEffect(() => {
    if (!isClientSide) {
      return;
    }

    setStorageValue(key, value);
  }, [key, isClientSide, value]);

  return [value, setValue] as const;
};

export default useLocalState;
