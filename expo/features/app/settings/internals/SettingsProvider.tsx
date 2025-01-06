import SettingsStore from '@hpapp/system/kvs/SettingsStore';
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

export interface SettingsContext {
  timestamp: number;
  settingsList: SettingsStore<unknown>[];
  refresh: () => void;
}

const contextObj = createContext<SettingsContext>({
  timestamp: new Date().getTime(),
  settingsList: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refresh: () => {}
});

/**
 * A provider to manage settings in local storage
 * @param param0
 * @returns
 */
export default function SettingsProvider({
  children,
  settings
}: {
  children: React.ReactNode;
  settings: SettingsStore<unknown>[];
}) {
  const Provider = contextObj.Provider;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // hold settings in memory rather than accessing actual storage behind settings list.
  const [timestamp, setTimestamp] = useState<number>(new Date().getTime());
  useEffect(() => {
    // load all settings registered in Settings Store
    (async () => {
      await Promise.all(settings.map(async (s) => await s.load()));
      setIsLoading(false);
    })();
  }, [settings]);
  const value = useMemo(() => {
    return {
      timestamp,
      settingsList: settings,
      refresh: () => {
        setTimestamp(new Date().getTime());
      }
    };
  }, [timestamp, settings]);
  if (isLoading) {
    return null;
  }
  return <Provider value={value}>{children}</Provider>;
}

export function useSettings<T>(settings: SettingsStore<T>): [T | undefined, (value: T | null) => Promise<void>] {
  const ctx = useContext(contextObj);
  const setValue = useCallback(
    async (value: T | null) => {
      if (value === null) {
        await settings.clear();
        ctx.refresh();
      } else {
        await settings.save(value);
        ctx.refresh();
      }
    },
    [ctx, ctx.refresh]
  );
  return [settings.current as T, setValue];
}

export function useAllSettings(): SettingsStore<unknown>[] {
  const ctx = useContext(contextObj);
  return ctx.settingsList;
}
