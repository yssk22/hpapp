/**
 * provide a helper functions for objects
 * @module
 */

/**
 * check if the object is in the list (compared with === operator)
 * @param v an object
 * @param list a list of objects
 * @returns true if v is in the list
 */
export function isIn<T>(v: T, ...list: T[]) {
  return list.filter((vv) => v === vv).length > 0;
}

/**
 * normalize v into an arry if v is not an array
 * @param v - an array or an object
 * @returns - an arary
 */
export function normalizeA<T>(v: T | T[]) {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
}

/**
 * filter out null and undefined from an array
 * @param v - an array of objects
 * @returns - an array of objects without null and undefined
 */
export function filterNulls<T>(v: (T | null | undefined)[]): T[] {
  return v.filter((vv): vv is T => {
    return vv !== null && vv !== undefined;
  });
}
