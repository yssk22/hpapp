import { useState, useEffect } from 'react';

import useIsMounted from './useIsMounted';

type AsyncState<T> = {
  data?: T;
  error?: Error;
  loading: boolean;
};

export default function useAsync<T, F extends (...args: any[]) => Promise<T>>(
  fn: F,
  ...args: Parameters<F>
): AsyncState<T> {
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
