import { isIn, normalizeA, filterNulls } from './object';

describe('object', () => {
  test('isIn', () => {
    expect(isIn(1, 1, 2, 3)).toBe(true);
    expect(isIn(1, 2, 3)).toBe(false);
  });

  test('normalizeA', () => {
    expect(normalizeA(1)).toEqual([1]);
    expect(normalizeA([1])).toEqual([1]);
  });

  test('filterNulls', () => {
    expect(filterNulls([1, null, 2, undefined, 3])).toEqual([1, 2, 3]);
  });
});
