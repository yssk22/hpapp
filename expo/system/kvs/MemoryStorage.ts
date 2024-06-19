import { KeyValueStorage } from './types';

/**
 * MemoryStorage is a KeyValueStorage implementation for memory (`Map`)
 */
export default class MemoryStorage implements KeyValueStorage {
  private storage: Map<string, string>;

  constructor() {
    this.storage = new Map();
  }

  async get(key: string): Promise<string | null> {
    const value = this.storage.get(key);
    if (value === undefined) {
      return null;
    }
    return value;
  }

  async set(key: string, value: string): Promise<void> {
    this.storage.set(key, value);
  }

  async delete(key: string): Promise<void> {
    this.storage.delete(key);
  }
}
