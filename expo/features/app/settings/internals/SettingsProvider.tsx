import SettingsStore from '@hpapp/system/kvs/SettingsStore';
import { createContext, useContext, useMemo, useState, useEffect, useCallback } from 'react';

export interface SettingsContext {
  store: Map<string, unknown>;
  settingsList: SettingsStore<unknown>[];
  setValue: (key: string, value: unknown) => void;
}

const contextObj = createContext<SettingsContext>({
  store: new Map(),
  settingsList: [],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setValue: (_key: string, _value: unknown) => {}
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
  const [store, setStore] = useState<Map<string, unknown>>(new Map());
  useEffect(() => {
    // load all settings registered in Settings Store
    (async () => {
      const values = await Promise.all(settings.map(async (s) => await s.load()));
      const nextStore = new Map(store);
      values.forEach((value, i) => {
        const key = settings[i].storageKey;
        nextStore.set(key, value);
      });
      setStore(nextStore);
      setIsLoading(false);
    })();
  }, [settings]);
  const value = useMemo(() => {
    return {
      store,
      settingsList: settings,
      setValue: async (key: string, value: unknown) => {
        const nextStore = new Map(store);
        nextStore.set(key, value);
        setStore(nextStore);
      }
    };
  }, [store, settings]);
  if (isLoading) {
    return null;
  }
  return <Provider value={value}>{children}</Provider>;
}

export function useSettings<T>(settings: SettingsStore<T>): [T | undefined, (value: T | null) => Promise<void>] {
  const ctx = useContext(contextObj);
  const value = ctx.store.get(settings.storageKey);
  const setValue = useCallback(
    async (value: T | null) => {
      if (value === null) {
        await settings.clear();
        ctx.setValue(settings.storageKey, settings.options?.defaultValue);
      } else {
        await settings.save(value);
        ctx.setValue(settings.storageKey, value);
      }
    },
    [ctx.setValue, settings]
  );
  if (!ctx.store.has(settings.storageKey)) {
    throw new Error(`SettingsStore('${settings.storageKey}') is not initialized with context`);
  }
  return [value as T, setValue];
}

export function useAllSettings(): SettingsStore<unknown>[] {
  const ctx = useContext(contextObj);
  return ctx.settingsList;
}
