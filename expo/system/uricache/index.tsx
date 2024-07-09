import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as logging from 'system/logging';

type Metadata = {
  sourceURI?: string;
  cacheURI?: string;
  timestamp?: number;
};

const cacheDir = FileSystem.cacheDirectory + 'uricache';

export async function getOrCreateCacheURI(uri: string) {
  let cacheURI = await get(uri);
  if (cacheURI !== null) {
    return cacheURI;
  }
  cacheURI = await create(uri);
  return cacheURI ?? uri;
}

export async function init() {
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

export async function create(uri: string) {
  if (Platform.OS === 'web') {
    return uri;
  }
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

export async function get(uri: string) {
  if (Platform.OS === 'web') {
    return uri;
  }
  const encoded = encodeURIComponent(encodeURIComponent(uri));
  try {
    const metadataUri = cacheDir + '/' + encoded + '.metadata';
    const str = await FileSystem.readAsStringAsync(metadataUri);
    const metadata = JSON.parse(str) as Metadata;
    const cacheURI = metadata.cacheURI!;
    const blobInfo = await FileSystem.getInfoAsync(cacheURI);
    // TODO: evaluate the metadata to decide to use the cache or not
    if (!blobInfo.exists) {
      return null;
    }
    return cacheURI;
  } catch {
    return null;
  }
}
