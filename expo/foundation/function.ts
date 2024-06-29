/**
 * provide a helper functions to execute a function or promise
 * @module
 */

/**
 * set the timeout for a promise
 * @param timeout milliseconds to timeout
 * @param p a promise that needs to be timed out.
 *
 * @example
 * The following code will throw an error if the promise does not resolve within 1000 milliseconds.
 * ```ts
 * const p = withTimeout(
 *   1000,
 *   new Promise((resolve, reject) => {
 *     // long running task
 *   }
 * }
 */
export function withTimeout<T>(timeout: number, p: Promise<T>) {
  return Promise.race([
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, timeout);
    }),
    p
  ]);
}
