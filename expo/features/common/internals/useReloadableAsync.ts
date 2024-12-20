import { CacheOptions, FileSystemCache } from '@hpapp/system/cache';
import * as logging from '@hpapp/system/logging';
import { useCallback, useEffect, useState } from 'react';

import useIsMounted from './useIsMounted';

export type ReloadableAysncOptions<T> = {
  logEventName?: string;
  cache?: CacheOptions<T>;
  onError?: (e: Error) => void;
};

export type ReloadableAysncResult<T, V> = {
  data: null | V;
  error: null | Error;
  isLoading: boolean;
  reload: (params?: T) => Promise<void>;
};

/**
 * convert async function to hook with reload feature
 * @returns [data, isLoading, reload] - data is the result of the async function, isLoading is the loading state, reload is the function to reload the data
 */
export default function useReloadableAsync<T, V>(
  asyncFn: (params: T) => Promise<V>,
  initialParams: T,
  options: ReloadableAysncOptions<V> = {
    logEventName: '',
    cache: undefined
  }
): ReloadableAysncResult<T, V> {
  const mounted = useIsMounted();
  const [data, setData] = useState<null | V>(null);
  const [error, setError] = useState<null | Error>(null);
  const [isLoading, setIsLoading] = useState(true);
  const loadFn = useCallback(
    async (p: T = initialParams) => {
      mounted && setIsLoading(true);
      setError(null);
      try {
        const data = await asyncFn(p);
        if (mounted) {
          setData(data);
          if (options.cache !== undefined) {
            const cache = new FileSystemCache(options.cache);
            await cache.save(data);
          }
        }
        if (options.logEventName) {
          logging.Info(options.logEventName, 'async hook completed', {
            params: p
          });
        }
      } catch (e: any) {
        options.onError?.(e);
        if (mounted) {
          setData(null);
          setError(e);
          if (options.cache !== undefined) {
            const cache = new FileSystemCache(options.cache);
            await cache.clear();
          }
        }
        if (options.logEventName) {
          logging.Info(options.logEventName, 'async hook failed', {
            params: p,
            error: e.toString()
          });
        }
        return null;
      } finally {
        mounted && setIsLoading(false);
      }
    },
    [setData, setIsLoading]
  );

  const reload = useCallback(
    async (p: T = initialParams) => {
      await loadFn(p);
    },
    [loadFn]
  );

  useEffect(() => {
    if (options.cache !== undefined) {
      const cache = new FileSystemCache(options.cache);
      const loadCache = async () => {
        const data = await cache.load();
        if (mounted && data != null) {
          setData(data);
        }
      };
      loadCache();
    }
    reload(initialParams);
  }, [initialParams, reload, setData, setIsLoading, options.cache]);
  return {
    data,
    error,
    isLoading,
    reload
  };
}
