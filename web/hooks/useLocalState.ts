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
  const clientSide = typeof window !== 'undefined';
  const [value, setValue] = useState<T>(() =>
    clientSide ? getStorageValue(key) ?? initialState : initialState
  );

  useEffect(() => {
    if (!clientSide) {
      return;
    }

    setStorageValue(key, value);
  }, [key, clientSide, value]);

  return [value, setValue] as const;
};

export default useLocalState;
