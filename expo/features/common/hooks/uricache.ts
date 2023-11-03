import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import * as logging from 'system/logging';

type Metadata = {
  sourceURI?: string;
  cacheURI?: string;
  timestamp?: number;
};

const cacheDir = FileSystem.cacheDirectory + 'uricache';

function useCachedURI(uri: string): string | null {
  const [localUri, setLocalUri] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    (async () => {
      const cacheURI = await getCacheURI(uri);
      if (cacheURI !== null) {
        mounted && setLocalUri(cacheURI);
        return;
      }
      const created = await createCacheURI(uri);
      if (created !== null) {
        mounted && setLocalUri(created);
        return created;
      }
    })();
    return () => {
      mounted = false;
    };
  }, [uri]);
  return localUri;
}

const getCacheURI = async (uri: string): Promise<string | null> => {
  const encoded = encodeURIComponent(encodeURIComponent(uri));
  try {
    const metadataUri = cacheDir + '/' + encoded + '.metadata';
    const str = await FileSystem.readAsStringAsync(metadataUri);
    const metadata = JSON.parse(str) as Metadata;
    const cacheURI = metadata.cacheURI!;
    const blobInfo = await FileSystem.getInfoAsync(cacheURI);
    if (!blobInfo.exists) {
      return null;
    }
    return cacheURI;
  } catch {
    return null;
  }
};

const initURICache = async (): Promise<void> => {
  const dirInfo = await FileSystem.getInfoAsync(cacheDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
  } else {
    if (!dirInfo.isDirectory) {
      await FileSystem.deleteAsync(cacheDir);
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }
  }
};

const createCacheURI = async (uri: string): Promise<string | null> => {
  try {
    const encoded = encodeURIComponent(encodeURIComponent(uri));
    const cacheURI = cacheDir + '/' + encoded + '.cache';
    const metadataUri = cacheDir + '/' + encoded + '.metadata';
    const result = await FileSystem.downloadAsync(uri, cacheURI);
    if (result.status !== 200) {
      return null;
    }
    await FileSystem.writeAsStringAsync(
      metadataUri,
      JSON.stringify({
        sourceURI: uri,
        cacheURI,
        timestamp: new Date().getTime()
      })
    );
    return cacheURI;
  } catch (e: any) {
    logging.Error('features.common.hooks.uricache.createCacheURI', 'failed to create a cache URI', {
      error: e.toString()
    });
    return null;
  }
};

export { useCachedURI, initURICache };
