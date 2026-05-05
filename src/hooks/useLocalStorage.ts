import { useCallback, useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((current: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch {
      // The app can operate without persistent storage.
    }
  }, [key, storedValue]);

  const setValue = useCallback((value: T | ((current: T) => T)) => {
    setStoredValue((current) => (typeof value === "function" ? (value as (old: T) => T)(current) : value));
  }, []);

  return [storedValue, setValue];
}

