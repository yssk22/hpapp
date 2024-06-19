/**
 * provide a helper functions to handle errors
 *
 * @example
 * If you don't know what to show to the users when an error occurs, you can just use wrapRenderable to rethrow the error to the upper strean,
 * ```ts
 * try{
 *   // do something
 * }catch(e: unknown) {
 *   throw wrapRenderable(e);
 * }
 * ```
 * but if you know what to show, you can use RenderableError to customize the error message.
 * ```ts
 * try{
 *   // do something
 * }catch(e: unknown) {
 *   throw new RenderableError("your message", e);
 * }
 * ```
 * @module
 */

/**
 * an interface for objects that the string reurned by render() method is a human-readable error message.
 */
interface Renderable {
  render: () => string;
}

/**
 * an error class that implements Renderable interface.
 */
class RenderableError {
  name: string;
  message: string;
  inner: unknown;

  /**
   * @param msg - a message to be rendered to the users
   * @param e - internal error
   */
  constructor(msg: string, e: unknown) {
    this.message = msg;
    this.inner = e;
    this.name = 'RenderableError';
  }

  render() {
    return this.message;
  }
}

/**
 * check if the exception is renderable
 * @param value - unknown object caught in try-catch block
 * @returns true if the value is Renderable object.
 */
function isRenderable(value: unknown): value is Renderable {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const { render } = value as Record<keyof Renderable, unknown>;
  if (typeof render !== 'function') {
    return false;
  }
  return true;
}

/**
 * render an human-readable error message from an exception.
 * If e is not renderable, it returns 'something went wrong' and we log the error to the console.
 * @param e - unknown object caught in try-catch block
 * @returns a message that can be rendered to the users.
 */
const renderError = (e: unknown) => {
  if (isRenderable(e)) {
    return e.render();
  }
  if (e === null || e === undefined) {
    return null;
  }
  // TODO: we need a way to capture the error callstack than e.stack.
  //   it's still useful to log e.stack in development here while stacktrace in production is not much useful as
  //   it doesn't actually contain any readable sources.
  if (__DEV__) {
    if ((e as Error).stack) {
      // eslint-disable-next-line no-console
      console.error((e as Error).stack);
    } else {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  }
  return 'something went wrong';
};

/**
 * wrap an exception to a RenderableError object if it is not renderable.
 * @param e - unknown object caught in try-catch block
 * @returns a Renderable object
 */
const wrapRenderable = (e: unknown) => {
  if (isRenderable(e)) {
    return e;
  }
  if (e === null || e === undefined) {
    return null;
  }
  return new RenderableError('something went wrong', e);
};

export { renderError, Renderable, wrapRenderable, RenderableError };
