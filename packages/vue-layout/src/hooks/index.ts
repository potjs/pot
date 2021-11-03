import type { Ref, ComputedRef, InjectionKey } from 'vue';
import { provide, inject, computed } from 'vue';
import { MenuMode, TriggerPlacement } from '../enums';
import { useEventListener } from './useEventListener';

export interface AjsConfigProviderProps extends Record<string, any> {
  menuMode: ComputedRef<MenuMode>;
  headerHeight: ComputedRef<string>;
  headerBackgroundColor: ComputedRef<string>;
  headerMix: ComputedRef<boolean>;
  sidebarWidth: ComputedRef<string>;
  sidebarCollapsedWidth: ComputedRef<string>;
  sidebarBackgroundColor: ComputedRef<string>;
  footer: ComputedRef<boolean>;
  footerHeight: ComputedRef<string>;
  footerBackgroundColor: ComputedRef<string>;
  trigger: ComputedRef<TriggerPlacement>;
  collapsed: Ref<boolean>;
  isMobile: Ref<boolean>;
}

export interface AjsHookProviderProps extends Record<string, any> {
  toggleSidebar: () => void;
  isFullHeader: ComputedRef<boolean>;
  hasSidebar: ComputedRef<boolean>;
}

export const AjsConfigProviderKey: InjectionKey<AjsConfigProviderProps> =
  Symbol('AjsConfigProvider');
export const AjsHookProviderKey: InjectionKey<AjsHookProviderProps> = Symbol('AjsHookProvider');

export const useProvideHooks = (state: AjsHookProviderProps) => {
  provide(AjsHookProviderKey, state);
};

export const useInjectHooks = () => {
  return inject(AjsHookProviderKey) as AjsHookProviderProps;
};

export const useProvideConfig = (props: AjsConfigProviderProps) => {
  provide(AjsConfigProviderKey, props);

  useProvideHooks({
    toggleSidebar(): void {
      props.collapsed.value = !props.collapsed.value;
    },
    isFullHeader: computed((): boolean => !props.headerMix.value),
    hasSidebar: computed((): boolean => props.menuMode.value !== MenuMode.TOP_MENU),
  });
};

export const useInjectConfig = () => {
  return inject(AjsConfigProviderKey) as AjsConfigProviderProps;
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
