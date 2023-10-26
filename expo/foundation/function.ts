function WithTimeout<T>(timeout: number, p: Promise<T>) {
  return Promise.race([
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'));
      }, timeout);
    }),
    p
  ]);
}

export { WithTimeout };
