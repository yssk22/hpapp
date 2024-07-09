import { sleep, isJest } from './globals';

beforeEach(() => {
  jest.useFakeTimers();
});

describe('globals', () => {
  test('sleep', async () => {
    const start = Date.now();
    const p = sleep(1000);
    jest.advanceTimersByTime(1000);
    await jest.runAllTimersAsync();
    await p;
    const end = Date.now();
    expect(end - start).toBeGreaterThanOrEqual(1000);
  });

  test('isJest', () => {
    expect(isJest()).toBe(true);
  });
});
