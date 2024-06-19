/**
 * provides helper functions for testing
 * @module
 */
import { readFile as readFileOrig } from 'fs';

/**
 * read a file from a local file path
 * @param path a local file path
 * @returns a Promise to read files. If the file does not exist, it returns an empty string.
 */
function readFile(path: string): Promise<string> {
  return new Promise((resolve, reject) => {
    readFileOrig(path, (err, data) => {
      if (err !== null) {
        return reject(err);
      }
      return resolve(data.toString());
    });
  });
}

/**
 * read a JSON formatted file
 * @param path a local file path
 * @returns a Promise to a read file and resolve it as JSO. If the file does not exist, it returns an empty string.
 */
async function readFileAsJSON<T>(path: string): Promise<T> {
  const json = await readFile(path);
  return JSON.parse(json) as T;
}

export { readFile, readFileAsJSON };
