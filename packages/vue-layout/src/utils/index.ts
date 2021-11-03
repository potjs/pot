import { ThemeConfig } from '../enums';

/**
 * Set Css Style
 * @param prop
 * @param val
 * @param dom
 */
export function setCssVar(prop: ThemeConfig, val: any, dom = document.documentElement) {
  dom.style.setProperty(prop, val);
}

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
