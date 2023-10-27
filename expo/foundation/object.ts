function In<T>(v: T, ...list: T[]) {
  return list.filter((vv) => v === vv).length > 0;
}

function NormalizeA<T>(v: T | T[]) {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
}

function filterNulls<T>(v: (T | null | undefined)[]): T[] {
  return v.filter((vv): vv is T => {
    return vv !== null && vv !== undefined;
  });
}

export { In, NormalizeA, filterNulls };
