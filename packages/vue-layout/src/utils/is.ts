export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string => objectToString.call(value);

export const toRawType = (value: unknown): string => {
  // extract "RawType" from strings like "[object RawType]"
  return toTypeString(value).slice(8, -1);
};

export const isArray = Array.isArray;

export const isObject = (val: unknown): val is Record<any, any> =>
  val !== null && typeof val === 'object';

export const isFunction = (val: unknown): val is Function => typeof val === 'function';

export const isString = (val: unknown): val is string => typeof val === 'string';

export const isBool = (val: unknown): val is boolean => typeof val === 'boolean';

export const isNumber = (val: unknown): val is number => typeof val === 'number';

export const isHTMLElement = (val: unknown) => toRawType(val).startsWith('HTML');
