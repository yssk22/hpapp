import * as logging from '@hpapp/system/logging';
import { useCallback, useEffect, useState } from 'react';

export type ReloadableAysncOptions = {
  logEventName?: string;
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
  options: ReloadableAysncOptions = {
    logEventName: ''
  }
): ReloadableAysncResult<T, V> {
  let mounted = true;
  const [data, setData] = useState<null | V>(null);
  const [error, setError] = useState<null | Error>(null);
  const [isLoading, setIsLoading] = useState(true);
  const reload = useCallback(
    async (p: T = initialParams) => {
      mounted && setIsLoading(true);
      setError(null);
      try {
        const applications = await asyncFn(p);
        if (options.logEventName) {
          logging.Info(options.logEventName, 'async hook completed', {
            params: p
          });
        }
        mounted && setData(applications);
      } catch (e: any) {
        if (options.logEventName) {
          logging.Error(options.logEventName, 'async hook failed', {
            params: p,
            error: e
          });
        }
        setError(e);
      } finally {
        mounted && setIsLoading(false);
      }
    },
    [setData, setIsLoading]
  );
  useEffect(() => {
    reload(initialParams);
    return () => {
      mounted = false;
    };
  }, [initialParams, setData, setIsLoading]);
  return {
    data,
    error,
    isLoading,
    reload
  };
}
