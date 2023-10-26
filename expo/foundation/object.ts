function In<T>(v: T, ...list: T[]) {
  return list.filter((vv) => v === vv).length > 0;
}

function NormalizeA<T>(v: T | T[]) {
  if (Array.isArray(v)) {
    return v;
  }
  return [v];
}

export { In, NormalizeA };
