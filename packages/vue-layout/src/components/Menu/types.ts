export interface MenuOptions {
  label: string;
  icon?: string;
  key?: string;
  disabled?: boolean;
  children?: MenuOptions[];
}

export interface RenderLabelWithMenu {
  (item: MenuOptions): string | HTMLElement;
}
