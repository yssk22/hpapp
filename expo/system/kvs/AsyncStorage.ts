import RNAsyncStorage from '@react-native-async-storage/async-storage';

import { KeyValueStorage } from './types';

export default class AsyncStorage implements KeyValueStorage {
  async get(key: string): Promise<string | null> {
    return await RNAsyncStorage.getItem(key);
  }

  async set(key: string, value: string): Promise<void> {
    await RNAsyncStorage.setItem(key, value);
  }

  async delete(key: string): Promise<void> {
    await RNAsyncStorage.removeItem(key);
  }
}
