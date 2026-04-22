import { useCallback, useEffect, useState } from 'react';
import { readLocal, writeLocal } from '../lib/storage/localStorage';

export function useLocalStorageState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => readLocal<T>(key, initial));

  useEffect(() => {
    writeLocal(key, value);
  }, [key, value]);

  const update = useCallback((v: T | ((prev: T) => T)) => {
    setValue((prev) => (typeof v === 'function' ? (v as (p: T) => T)(prev) : v));
  }, []);

  const reset = useCallback(() => setValue(initial), [initial]);

  return [value, update, reset];
}
