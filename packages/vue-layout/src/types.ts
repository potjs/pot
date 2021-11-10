export interface MenuOptions {
  label: string;
  icon?: string;
  key?: string;
  disabled?: boolean;
  children?: MenuOptions[];
  [s: string]: any;
}

export interface RenderLabelWithMenu {
  (item: MenuOptions): string | HTMLElement;
}

export interface Theme {
  dark: string;
  light: string;
  [s: string]: any;
}
