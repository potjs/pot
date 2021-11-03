export function isFunction(val: unknown): val is Function {
  return !!val && typeof val === 'function';
}

export function isUndefined(val: unknown): boolean {
  return val === undefined || typeof val === 'undefined';
}
