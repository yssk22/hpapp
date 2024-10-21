import { useState, useEffect } from 'react';

import useIsMounted from './useIsMounted';

type AsyncState<T> = {
  data?: T;
  error?: Error;
  loading: boolean;
};

export default function useAsync<T>(fn: (...args: any[]) => Promise<T>, ...args: Parameters<typeof fn>): AsyncState<T> {
  const isMounted = useIsMounted();
  const [state, setState] = useState<AsyncState<T>>({
    loading: true
  });

  useEffect(() => {
    fn(...args)
      .then((data) => {
        if (isMounted) {
          setState({ data, loading: false });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({ error, loading: false });
        }
      });
  }, [fn, ...args]);

  return state;
}
