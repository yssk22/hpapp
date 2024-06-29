import * as path from 'path';

import { readFile, readFileAsJSON } from './test_helper';

describe('test_helper', () => {
  test('readFile', async () => {
    // test the readFile function
    const content = await readFile(path.join(__dirname, 'testdata', 'test_helper.txt'));
    expect(content).toEqual('abcde');
  });

  test('readFileAsJSON', async () => {
    // test the readFile function
    const content = await readFileAsJSON<{ field: string }>(path.join(__dirname, 'testdata', 'test_helper.json'));
    expect(content.field).toEqual('value');
  });
});
