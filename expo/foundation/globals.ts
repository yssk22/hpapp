export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isJest() {
  return process.env.JEST_WORKER_ID !== undefined;
}
