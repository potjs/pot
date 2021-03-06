import type { Slots } from 'vue';

export type FunctionArgs<Args extends any[] = any[]> = (...args: Args) => void;

export function debounce<T extends FunctionArgs>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return function (this: any, ...args: any[]) {
    if (timer) {
      clearTimeout(timer);
    }
    if (delay <= 0) {
      return fn.apply(this, args);
    }
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}

export type TreeFindFilter<Args extends any[] = any[]> = (...args: Args) => boolean;
export function treeFindPath<T extends Record<string, any>>(
  tree: T[],
  func: TreeFindFilter,
  key: keyof T = 'id',
  path: string[] = [],
): string[] {
  if (!tree) return [];
  for (const data of tree) {
    path.push(data[key]);
    if (func(data)) return path;
    if (data.children) {
      const findChildren = treeFindPath(data.children, func, key, path);
      if (findChildren.length) return findChildren;
    }
    path.pop();
  }
  return [];
}

export function extendSlots(slots: Slots, extendKeys: string[] = [], data?: any): Slots {
  return extendKeys.reduce((obj: Record<string, any>, name: string) => {
    // from <alias> to <key>
    const [key, alias = key] = name.split(':');
    if (slots[alias]) {
      obj[key] = (args: any) => slots[alias]?.(Object.assign({}, data, args));
    }
    return obj;
  }, {});
}
