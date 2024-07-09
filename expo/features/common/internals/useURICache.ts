import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from 'react';
import * as logging from 'system/logging';

type Metadata = {
  sourceURI?: string;
  cacheURI?: string;
  timestamp?: number;
};

const cacheDir = FileSystem.cacheDirectory + 'uricache';

export default function useURICache(uri: string): string | null {
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

export async function initURICache() {
  const dirInfo = await FileSystem.getInfoAsync(cacheDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
  } else {
    if (!dirInfo.isDirectory) {
      await FileSystem.deleteAsync(cacheDir);
      await FileSystem.makeDirectoryAsync(cacheDir, { intermediates: true });
    }
  }
}

async function createCacheURI(uri: string) {
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
}

async function getCacheURI(uri: string) {
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
}
