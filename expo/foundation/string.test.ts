import { isEmpty, maskString } from './string';

describe('string', () => {
  test('isEmpty', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('abc')).toBe(false);
  });

  test('maskString', () => {
    expect(maskString('1234567890')).toEqual('****');
    expect(maskString('1234567890', { mask: 'X', showFirstNChars: 3, numMasks: 2 })).toEqual('123XX');
  });
});
