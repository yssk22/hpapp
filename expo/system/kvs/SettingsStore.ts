import { KeyValueStorage } from "./types";
import JSONStore from "./JSONStore";

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

  private constructor(
    storageKey: string,
    storage: KeyValueStorage,
    options?: SettingsStoreOptions<T>
  ) {
    this.storageKey = storageKey;
    this.storage = new JSONStore(storage);
    this.data = undefined;
    this.options = options;
    this.loaded = false;
  }

  async load(): Promise<T | undefined> {
    if (this.data === undefined) {
      const stored = (await this.storage.get(this.storageKey)) || undefined;
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
          this.save(migration);
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
        timestamp: new Date().getTime(),
      },
      value: data,
    });
    this.loaded = true;
  }

  async clear(): Promise<void> {
    this.storage.delete(this.storageKey);
    this.loaded = true;
  }
}
