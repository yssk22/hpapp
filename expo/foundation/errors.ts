interface Renderable {
  render: () => string;
}

class RenderaleError {
  name: string;
  message: string;
  inner: unknown;

  constructor(msg: string, e: unknown) {
    this.message = msg;
    this.inner = e;
    this.name = "RenderableError";
  }

  render() {
    return this.message;
  }
}

function isRenderable(value: unknown): value is Renderable {
  if (typeof value !== "object" || value === null) {
    return false;
  }
  const { render } = value as Record<keyof Renderable, unknown>;
  if (typeof render !== "function") {
    return false;
  }
  return true;
}

function renderError(e: unknown) {
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
      console.error((e as Error).stack);
    } else {
      console.error(e);
    }
  }
  return "something went wrong";
}

function wrapRenderable(e: unknown) {
  if (isRenderable(e)) {
    return e;
  }
  if (e === null || e === undefined) {
    return null;
  }
  return new RenderaleError("something went wrong", e);
}

export { renderError, Renderable, wrapRenderable, RenderaleError };
