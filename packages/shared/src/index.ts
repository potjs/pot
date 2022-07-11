export * from './is';

export * from './dom';

export function awaitTo<T, U = any>(promise: Promise<T>): Promise<[U | undefined, undefined | T]> {
  return promise
    .then<[undefined, T]>((data) => [undefined, data])
    .catch<[U, undefined]>((err) => [err, undefined]);
}
