import { withTimeout } from './function';
import { sleep } from './globals';

describe('function', () => {
  test('withTimeout', async () => {
    jest.useRealTimers();
    await expect(withTimeout(100, sleep(200))).rejects.toThrow(Error);
    await expect(withTimeout(200, sleep(100))).resolves.toBeUndefined();
  });
});
