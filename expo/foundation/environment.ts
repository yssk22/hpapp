const getGlobal = (): any => {
  if (global) {
    return global;
  }
  return {};
};

/**
 * Returns true if the code is running in a development environment.
 * @returns true if the code is running in a development environment
 */
export function maybeDev(): boolean {
  const g = getGlobal();
  if (g.__DEV__) {
    return true;
  }
  if (maybeTest()) {
    return true;
  }
  if (g.window?.document?.location.hostname) {
    return g.window.document.location.hostname.startsWith('localhost');
  }
  return false;
}

export function maybeTest(): boolean {
  const g = getGlobal();
  if (g.process?.argv && g.process.argv.length > 0) {
    for (let i = 0; i < g.process.argv.length; i++) {
      const v = g.process.argv[i];
      if (v.endsWith('/jest')) {
        return true;
      }
      if (v.endsWith('/jest.js')) {
        return true;
      }
      if (v.includes('node_modules/jest-worker')) {
        return true;
      }
    }
  }
  return false;
}
