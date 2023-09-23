interface KeyValueStorage {
  get(key: string): Promise<string | null>;
  set(key: string, value: string | null): Promise<void>;
  delete(key: string): Promise<void>;
}

export { KeyValueStorage };
