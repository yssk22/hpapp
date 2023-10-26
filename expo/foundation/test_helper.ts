import { readFile as readFileOrig } from 'fs';

function readFile(path: string): Promise<string> {
  return new Promise((resolve) => {
    readFileOrig(path, (err, data) => {
      return err ? resolve('') : resolve(data.toString());
    });
  });
}

async function readFileAsJSON<T>(path: string): Promise<T> {
  const json = await readFile(path);
  return JSON.parse(json) as T;
}

export { readFile, readFileAsJSON };
