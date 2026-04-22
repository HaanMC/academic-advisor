import { useCallback, useEffect, useRef, useState } from 'react';
import { idbGet, idbPut, type StoreName } from '../lib/storage/indexedDB';

export function useIndexedDBState<T>(
  store: StoreName,
  key: string,
  initial: T,
  options: { debounceMs?: number } = {},
): {
  value: T;
  setValue: (v: T | ((prev: T) => T)) => void;
  loaded: boolean;
  flush: () => Promise<void>;
} {
  const [value, setValueState] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  const valueRef = useRef(value);
  valueRef.current = value;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const debounce = options.debounceMs ?? 400;

  useEffect(() => {
    let alive = true;
    idbGet<T>(store, key)
      .then((stored) => {
        if (!alive) return;
        if (stored !== undefined) setValueState(stored);
        setLoaded(true);
      })
      .catch(() => {
        if (alive) setLoaded(true);
      });
    return () => {
      alive = false;
    };
  }, [store, key]);

  useEffect(() => {
    if (!loaded) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      idbPut(store, key, valueRef.current).catch(() => undefined);
    }, debounce);
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [value, store, key, loaded, debounce]);

  const setValue = useCallback((v: T | ((prev: T) => T)) => {
    setValueState((prev) => (typeof v === 'function' ? (v as (p: T) => T)(prev) : v));
  }, []);

  const flush = useCallback(async () => {
    if (timer.current) clearTimeout(timer.current);
    await idbPut(store, key, valueRef.current);
  }, [store, key]);

  return { value, setValue, loaded, flush };
}
