const cloudStoragePublicPrefix = 'https://storage.googleapis.com/';
const cloudStorageAuthPrefix = 'https://storage.cloud.google.com/';

export function IsCloudStorageURL(url: string) {
  return url.startsWith(cloudStoragePublicPrefix) || url.startsWith(cloudStorageAuthPrefix);
}

/**
 * Replace the storage.cloud.google.com with storage.googleapis.com.
 * This is an adhoc fixer function for legcy blob records that uses storage.cloud.google.com. We now expose the blob storage to the public using storage.googleapis.com.
 *
 * @param url Cloud Storage URL
 * @returns A url that anyone can access
 */
export function GetPublicCloudStorageURL(url: string) {
  if (url.startsWith(cloudStorageAuthPrefix)) {
    return url.replace(cloudStorageAuthPrefix, cloudStoragePublicPrefix);
  }
  return url;
}
