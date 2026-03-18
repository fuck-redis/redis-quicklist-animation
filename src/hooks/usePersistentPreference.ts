import { useEffect, useRef, useState } from 'react';
import { getFromDb, setToDb } from '@/utils/indexedDb';

export function usePersistentPreference<T>(key: string, fallback: T): [T, (value: T) => void, boolean] {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const firstWriteRef = useRef(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const cached = await getFromDb<T>(`pref:${key}`);
      if (!cancelled && cached?.value !== undefined) {
        setValue(cached.value);
      }
      if (!cancelled) {
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (firstWriteRef.current) {
      firstWriteRef.current = false;
      return;
    }
    void setToDb(`pref:${key}`, value);
  }, [key, ready, value]);

  const update = (next: T) => {
    setValue(next);
  };

  return [value, update, ready];
}
