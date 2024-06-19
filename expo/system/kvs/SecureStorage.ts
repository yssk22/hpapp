import * as SecureStore from 'expo-secure-store';

import { KeyValueStorage } from './types';

/**
 * SecureStorage is a wrapper for `expo-secure-store` as KeyValueStorage
 */
export default class SecureStorage implements KeyValueStorage {
  private options: SecureStore.SecureStoreOptions | undefined;

  constructor(options?: SecureStore.SecureStoreOptions) {
    this.options = options;
  }

  async get(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key, this.options);
  }

  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value, this.options);
  }

  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key, this.options);
  }
}
