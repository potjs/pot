//
export type Nullable<T> = T | null;

export enum MenuMode {
  // left menu
  SIDE = 'side',
  MIX_SIDE = 'mix-side',
  MIX = 'mix',
  // top menu
  TOP = 'top',
}

export enum TriggerPlacement {
  TOP = 'top',
  BOTTOM = 'bottom',
  NONE = 'none',
}

export enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface MenuRaw {
  label: string;
  icon?: string;
  key?: string;
  disabled?: boolean;
  children?: MenuRaw[];
  [s: string]: any;
}

export interface RenderLabelWithMenu {
  (item: MenuRaw): string | HTMLElement;
}
