import type { Ref, ComputedRef, InjectionKey } from 'vue';
import { provide, inject } from 'vue';
import { MenuMode, MenuRaw, RenderLabelWithMenu, TriggerPlacement, Theme } from '../types';
import { useEventListener } from './useEventListener';

export interface PotConfigProviderProps {
  prefixCls: ComputedRef<string>;
  menuTheme: ComputedRef<Theme>;
  menuMode: ComputedRef<MenuMode>;
  menuData: ComputedRef<MenuRaw[]>;
  menuIndent: ComputedRef<number>;
  menuKey: ComputedRef<string>;
  menuActive: ComputedRef<string>;
  menuActivePaths: ComputedRef<string[]>;
  triggerPlacement: ComputedRef<TriggerPlacement>;
  collapsed: Ref<boolean>;
  isMobile: Ref<boolean>;

  hasSidebar: ComputedRef<boolean>;
  isFullHeader: ComputedRef<boolean>;

  renderMenuLabel: ComputedRef<RenderLabelWithMenu>;

  onMenuSelect: (...args: any[]) => void;
}

export interface PotHookProviderProps extends Record<string, any> {
  toggleSidebar: () => void;
}

export const PotConfigProviderKey: InjectionKey<PotConfigProviderProps> =
  Symbol('PotConfigProvider');
export const PotHookProviderKey: InjectionKey<PotHookProviderProps> = Symbol('PotHookProvider');

export const useProvideHooks = (state: PotHookProviderProps) => {
  provide(PotHookProviderKey, state);
};

export const useInjectHooks = () => {
  return inject(PotHookProviderKey) as PotHookProviderProps;
};

export const useProvideConfig = (props: PotConfigProviderProps) => {
  provide(PotConfigProviderKey, props);

  useProvideHooks({
    toggleSidebar(): void {
      props.collapsed.value = !props.collapsed.value;
    },
  });
};

export const useInjectConfig = () => {
  return inject(PotConfigProviderKey) as PotConfigProviderProps;
};

export interface WindowResizeCallback {
  width: number;
}

export const useWindowResizeListener = <T extends (obj: WindowResizeCallback) => void>(fn: T) => {
  function resize() {
    fn({
      width: document.body.clientWidth,
    });
  }
  resize();

  useEventListener({
    el: window,
    name: 'resize',
    listener: () => {
      resize();
    },
  });
};
