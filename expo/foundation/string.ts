/**
 * provide a helper functions for string.
 *
 * You may have a various type of representation of a date in your application so this module also help you to convert the representation to a Date object.
 *
 * @module
 */

/**
 * check if a string is empty or not
 * @param t a string to be checked
 * @returns true if a string is "", null or undefined
 */
const isEmpty = (t: string | null | undefined): boolean => {
  if (t === undefined || t === null || t === '') {
    return true;
  }
  return false;
};

export { isEmpty };
