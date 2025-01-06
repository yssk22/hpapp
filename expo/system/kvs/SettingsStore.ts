import { Platform } from 'react-native';
import * as logging from 'system/logging';

import JSONStore from './JSONStore';
import LocalStorage from './LocalStorage';
import { KeyValueStorage } from './types';

type SettingsStoreOptions<T> = {
  readonly defaultValue?: T;
  readonly description?: string;
  readonly migrationFrom?: SettingsStore<T>;
};

type SettingsObject<T> = {
  meta: {
    key: string;
    timestamp: number;
  };
  value: T;
};

/**
 * SettingsStore is a implementation to store any local user settigs that helps save and load.
 * With this implementation, you don't have to worry about the storage and serialization and you'll get the proper type hint for your settings.
 */
export default class SettingsStore<T> {
  private static settingsList: Map<string, SettingsStore<unknown>> = new Map();

  // register a new SettingsStore object or return existing one.
  public static register<TT>(
    storageKey: string,
    storage: KeyValueStorage,
    options?: SettingsStoreOptions<TT>
  ): SettingsStore<TT> {
    if (this.settingsList.has(storageKey)) {
      return this.settingsList.get(storageKey)! as SettingsStore<TT>;
    }
    const instance = new SettingsStore(storageKey, storage, options);
    this.settingsList.set(storageKey, instance);
    return instance;
  }

  readonly storageKey: string;
  readonly storage: JSONStore<SettingsObject<T>>;
  private loaded: boolean;
  private data: T | undefined;
  readonly options?: SettingsStoreOptions<T>;

  private constructor(storageKey: string, storage: KeyValueStorage, options?: SettingsStoreOptions<T>) {
    this.storageKey = storageKey;
    if (Platform.OS === 'web') {
      // web is storybook only so we always use localStorage
      this.storage = new JSONStore(new LocalStorage());
    } else {
      this.storage = new JSONStore(storage);
    }
    this.data = undefined;
    this.options = options;
    this.loaded = false;
  }

  async load(): Promise<T | undefined> {
    if (this.data === undefined) {
      const stored = (await this.storage.get(this.storageKey)) ?? undefined;
      const timestamp = stored?.meta?.timestamp;
      if (timestamp !== undefined) {
        this.data = stored!.value;
      }
      this.loaded = true;
    }

    if (this.data === undefined) {
      if (this.options?.migrationFrom) {
        const oldStore = this.options?.migrationFrom;
        const migration = await oldStore.load();
        if (migration !== undefined) {
          await this.save(migration);
          this.data = migration;
          await oldStore.clear();
        }
      }
    }
    if (this.data === undefined) {
      return this.options?.defaultValue;
    }
    return this.data;
  }

  async save(data: T): Promise<void> {
    await this.storage.set(this.storageKey, {
      meta: {
        key: this.storageKey,
        timestamp: new Date().getTime()
      },
      value: data
    });
    this.data = data;
    this.loaded = true;
  }

  async clear(): Promise<void> {
    this.storage.delete(this.storageKey);
    this.data = undefined;
    this.loaded = true;
  }

  get current(): T | undefined {
    if (!this.loaded) {
      logging.Error(
        'system.kvs.SettingsStore.current',
        'SettingsStore is not loaded yet, fallback to undefined or defaultValue',
        {
          key: this.storageKey
        }
      );
    }
    return this.data ?? this.options?.defaultValue;
  }
}
