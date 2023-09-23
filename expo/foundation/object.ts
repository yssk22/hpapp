function In<T>(v: T, ...list: T[]) {
  return list.filter((vv) => v == vv).length > 0;
}

export { In };
