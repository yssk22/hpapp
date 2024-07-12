import { getOrCreateCacheURI } from '@hpapp/system/uricache';

import useAsync from './useAsync';

export default function useURICache(uri: string) {
  const state = useAsync<string, (uri: string) => Promise<string>>(getOrCreateCacheURI, uri);
  return state;
}
