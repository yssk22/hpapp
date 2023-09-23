import { KeyValueStorage } from "./types";

// JSONStore is a wrapper KeyValueStorage to enforce stored value as a specific type T.
// DO NOT use T which doesn't support JSON.parse (like Date)
export default class JSONStore<T> {
  private storage: KeyValueStorage;

  constructor(storage: KeyValueStorage) {
    this.storage = storage;
  }

  async get(key: string): Promise<T | null | undefined> {
    const strValue = await this.storage.get(key);
    if (strValue == null) {
      return undefined;
    }
    return JSON.parse(strValue);
  }

  async set(key: string, value: T): Promise<void> {
    const strValue = JSON.stringify(value);
    await this.storage.set(key, strValue);
  }

  async delete(key: string): Promise<void> {
    await this.storage.delete(key);
  }
}
