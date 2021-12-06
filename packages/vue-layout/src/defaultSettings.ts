import type { ExtractPropTypes, PropType, ComputedRef, Slots } from 'vue';

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

export interface MenuSelectHandler {
  (index: string, menu: MenuRaw): void;
}

export interface MenuOpenHandler {
  (index: string, menu: MenuRaw): void;
}

export interface LayoutSettings {
  prefixCls: string;
  menuTheme: Theme | undefined;
  menuMode: MenuMode;
  menuData: MenuRaw[];
  menuIndent: number;
  menuKey: string;
  menuActive: string;
  trigger: TriggerPlacement;
}

export const defaultLayoutSettings: LayoutSettings = {
  prefixCls: 'pot-layout',
  menuTheme: undefined,
  menuMode: MenuMode.SIDE,
  menuData: [],
  menuIndent: 16,
  menuKey: 'key',
  menuActive: '',
  trigger: TriggerPlacement.TOP,
};

export const defaultLayoutProps = {
  prefixCls: {
    type: String,
    default: defaultLayoutSettings.prefixCls,
  },
  menuTheme: {
    type: String as PropType<Theme>,
    default: defaultLayoutSettings.menuTheme,
  },
  menuMode: {
    type: String as PropType<MenuMode>,
    default: defaultLayoutSettings.menuMode,
  },
  menuData: {
    type: Array as PropType<MenuRaw[]>,
    default: () => defaultLayoutSettings.menuData,
  },
  menuIndent: {
    type: Number,
    default: defaultLayoutSettings.menuIndent,
  },
  menuKey: {
    type: String,
    default: defaultLayoutSettings.menuKey,
  },
  menuActive: {
    type: String,
    default: defaultLayoutSettings.menuActive,
  },
  trigger: {
    type: String as PropType<TriggerPlacement>,
    default: defaultLayoutSettings.trigger,
  },
};

export type LayoutProps = Partial<ExtractPropTypes<typeof defaultLayoutProps>>;

export type EmitType = 'menuSelect' | 'update:collapsed';

export interface LayoutShared {
  hasSidebar: ComputedRef<boolean>;
  isMenuInHeader: ComputedRef<boolean>;
  isFullHeader: ComputedRef<boolean>;
  isCollapsed: ComputedRef<boolean>;
  isMobile: ComputedRef<boolean>;
  getMenuActivePaths: ComputedRef<string[]>;
  getMenuOpened: ComputedRef<string[]>;
  getSlots: (slotNames: string[]) => Slots;

  onMenuSelect: MenuSelectHandler;
  onMenuOpen: MenuOpenHandler;
  toggleSidebar: () => void;
}
