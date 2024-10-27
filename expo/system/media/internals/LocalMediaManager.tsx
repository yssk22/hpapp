import { GetPublicCloudStorageURL } from '@hpapp/system/utils';
import AsyncLock from 'async-lock';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as SQLite from 'expo-sqlite';
import * as path from 'path';

const BaseCacheDir = FileSystem.cacheDirectory + 'hellofan/media';

const CreateAssetTableSQL =
  'CREATE TABLE IF NOT EXISTS assets (uri TEXT PRIMARY KEY NOT NULL, asset_id TEXT NOT NULL);';
const SelectAssetTableSQL = 'SELECT uri, asset_id FROM assets WHERE uri=? LIMIT 1';
const InsertAssetTableSQL = 'INSERT INTO assets VALUES (?, ?) ON CONFLICT(uri) DO UPDATE SET asset_id = ?';

const CreateAlbumTableSQL =
  'CREATE TABLE IF NOT EXISTS albums (name TEXT PRIMARY KEY NOT NULL, album_id TEXT NOT NULL);';
const InsertAlbumTableSQL = 'INSERT INTO albums VALUES (?, ?) ON CONFLICT(name) DO UPDATE SET album_id = ?';

const AlbumLockOption = {
  timeout: 10000
};

class LocalMediaManager {
  private db: SQLite.SQLiteDatabase;
  private lock: AsyncLock;
  private _isAvailable: boolean;

  constructor(name: string) {
    this.db = SQLite.openDatabaseSync(name);
    this.lock = new AsyncLock();
    this._isAvailable = false;
  }

  get isAvailable() {
    return this._isAvailable;
  }

  async init(): Promise<void> {
    this._isAvailable = await this.validateSQLiteVersion();
    await Promise.all([this.db.execAsync(CreateAssetTableSQL), this.db.execAsync(CreateAlbumTableSQL)]);
  }

  async getAssetIDFromURI(uri: string): Promise<string | null> {
    uri = GetPublicCloudStorageURL(uri);
    const result = await this.db.getFirstAsync<{ asset_id: string }>(SelectAssetTableSQL, [uri]);
    return result?.asset_id ?? null;
  }

  async getAssetFromURI(uri: string): Promise<MediaLibrary.AssetInfo | null> {
    uri = GetPublicCloudStorageURL(uri);
    const assetID = await this.getAssetIDFromURI(uri);
    if (assetID === null) {
      return null;
    }
    try {
      // this could return null even asset exists due to https://github.com/expo/expo/issues/11864
      return await MediaLibrary.getAssetInfoAsync(assetID);
    } catch {
      throw new Error(`cannot get asset info from assetID:${assetID}`);
    }
  }

  async getOrCreateAlbumFromName(name: string): Promise<MediaLibrary.Album | null> {
    let album: MediaLibrary.Album | null = null;
    try {
      album = await MediaLibrary.getAlbumAsync(name);
    } catch {
      // not found
    }
    if (album === null) {
      try {
        album = await MediaLibrary.createAlbumAsync(name);
      } catch {
        throw new Error(`cannot create album:${name}`);
      }
    }
    await this.upsertAlbumAsset(album, name);
    return album;
  }

  async upsertMediaAsset(asset: MediaLibrary.AssetInfo, uri: string): Promise<void> {
    const result = await this.db.runAsync(InsertAssetTableSQL, [uri, asset.id, asset.id]);
    if (result.changes === 0) {
      throw new Error(`cannot insert an asset: (${[uri, asset.id, asset.id].join(',')})`);
    }
  }

  async upsertAlbumAsset(album: MediaLibrary.Album, name: string): Promise<void> {
    const result = await this.db.runAsync(InsertAlbumTableSQL, [name, album.id, album.id]);
    if (result.changes === 0) {
      throw new Error(`cannot insert an album: (${[name, album.id, album.id].join(',')})`);
    }
  }

  private async makeDir(dir: string) {
    const dirInfo = await FileSystem.getInfoAsync(dir);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
    }
  }

  private async deleteFileSafe(path: string) {
    try {
      await FileSystem.deleteAsync(path);
    } catch {
      // ignore if the cache file could not be deleted.
    }
  }

  async createAsset(path: string): Promise<MediaLibrary.AssetInfo> {
    let asset: MediaLibrary.AssetInfo;
    try {
      asset = await MediaLibrary.createAssetAsync(path);
    } catch {
      throw new Error(`cannot create an asset for ${path}`);
    }
    return asset;
  }

  async saveToAsset(
    uri: string,
    albumName?: string
  ): Promise<{
    asset: MediaLibrary.AssetInfo;
    saved: boolean;
  }> {
    uri = GetPublicCloudStorageURL(uri);
    const granted = await MediaLibrary.requestPermissionsAsync();
    if (!granted.granted) {
      throw new Error('permission deined');
    }
    const existingAsset = await this.getAssetFromURI(uri);
    // asset exists
    if (existingAsset !== null) {
      // make sure that the asset is in the album
      if (albumName) {
        await this.addAssetToAlbum(existingAsset, albumName);
      }
      return {
        asset: existingAsset,
        saved: false
      };
    }
    await this.makeDir(BaseCacheDir);
    const dst = await this.getLocalPathFromUri(uri);
    const dstInfo = await FileSystem.getInfoAsync(dst);
    const content_uri = await FileSystem.getContentUriAsync(dst);

    // cache exists
    if (dstInfo.exists) {
      const asset = await this.createAsset(dst);
      if (albumName) {
        await this.addAssetToAlbum(asset, albumName);
      }
      await this.upsertMediaAsset(asset, uri);
      await this.deleteFileSafe(content_uri);
      //   logEvent('CreateAssetFromCache', {
      //     uri: uri,
      //     album_name: albumName,
      //   });
      return {
        asset,
        saved: true
      };
    }

    // download and create an asset
    const obj = await FileSystem.downloadAsync(uri, dst);
    if (obj.status !== 200) {
      throw new Error(`cannot download ${uri}: status=${obj.status}`);
    }
    const asset = await this.createAsset(dst);
    if (albumName) {
      await this.addAssetToAlbum(asset, albumName);
    }
    await this.upsertMediaAsset(asset, uri);
    await this.deleteFileSafe(content_uri);
    // logEvent('CreateAssetFromURI', {
    //   uri: uri,
    //   album_name: albumName,
    // });
    return { asset, saved: true };
  }

  async getLocalPathFromUri(uri: string): Promise<string> {
    return path.join(BaseCacheDir, encodeURIComponent(encodeURIComponent(uri)));
  }

  async addAssetToAlbum(asset: MediaLibrary.AssetInfo, albumName: string): Promise<MediaLibrary.Album> {
    return await this.lock.acquire(
      albumName,
      async (): Promise<MediaLibrary.Album> => {
        let album: MediaLibrary.Album | null = null;
        try {
          album = await MediaLibrary.getAlbumAsync(albumName);
        } catch {
          // album not found
        }
        if (album === null) {
          // create an album with the asset
          return await MediaLibrary.createAlbumAsync(albumName, asset);
        }
        // just add the asset to the album
        await MediaLibrary.addAssetsToAlbumAsync(asset, album, false);
        return album;
      },
      AlbumLockOption
    );
  }

  getAlbumNameFromMemberName(memberName: string) {
    return `hellofanapp.${memberName}`;
  }

  private async validateSQLiteVersion() {
    const result = await this.db.getFirstAsync<{ version: string }>('SELECT sqlite_version() as version', []);
    if (result === null) {
      return false;
    }
    const tmp = result.version.split('.');
    if (tmp.length < 2) {
      return false;
    }
    const major = parseInt(tmp[0], 10);
    const minor = parseInt(tmp[1], 10);
    // have to be >= 3.24.0 since we use UPSERT
    // https://www.sqlite.org/lang_UPSERT.html
    if (major < 3) {
      return false;
    }
    if (major === 3 && minor < 24) {
      return false;
    }
    return true;
  }
}

export default LocalMediaManager;
