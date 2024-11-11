import * as logging from '@hpapp/system/logging';
import * as FileSystem from 'expo-file-system';

async function defaultSaveFn<T>(data: T): Promise<string> {
  return JSON.stringify(data);
}

async function defaultLoadFn<T>(value: string): Promise<T | undefined> {
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}

const BaseCacheDir = [FileSystem.cacheDirectory, 'fscache'].join('/');

export type CacheOptions<T> = {
  key: string;
  saveFn?: (data: T) => Promise<string>;
  loadFn?: (data: string) => Promise<T | undefined>;
};

export class FileSystemCache<T> {
  key: string;
  saveFn: (data: any) => Promise<string>;
  loadFn: (value: string) => Promise<T | undefined>;

  constructor(options: CacheOptions<T>) {
    this.key = options.key;
    this.saveFn = options?.saveFn ?? defaultSaveFn;
    this.loadFn = options?.loadFn ?? defaultLoadFn;
  }

  public async save(data: T): Promise<void> {
    const cacheFilePath = [BaseCacheDir, this.key].join('/');
    try {
      const dirInfo = await FileSystem.getInfoAsync(BaseCacheDir);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BaseCacheDir, { intermediates: true });
      }
      const str = await this.saveFn(data);
      await FileSystem.writeAsStringAsync(cacheFilePath, str);
      logging.Info('system.cache.FileSystemCache', 'save', {
        key: this.key
      });
    } catch (e) {
      logging.Error('system.cache.FileSystemCache', 'save error', {
        key: this.key,
        error: e
      });
    }
  }

  public async load(): Promise<T | undefined> {
    const cacheFilePath = [BaseCacheDir, this.key].join('/');
    const fileInfo = await FileSystem.getInfoAsync(cacheFilePath);
    if (!fileInfo.exists) {
      logging.Info('system.cache.FileSystemCache', 'miss', {
        key: this.key
      });
      return undefined;
    }
    try {
      const str = await FileSystem.readAsStringAsync(cacheFilePath);
      const data = await this.loadFn(str);
      logging.Info('system.cache.FileSystemCache', 'load', {
        key: this.key
      });
      return data;
    } catch (e) {
      logging.Error('system.cache.FileSystemCache', 'error', {
        key: this.key,
        error: e
      });
      return undefined;
    }
  }
}
