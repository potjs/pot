import type { Ref, ComputedRef, InjectionKey } from 'vue';
import { provide, inject, computed } from 'vue';
import { MenuMode, TriggerPlacement } from '../enums';
import { useEventListener } from './useEventListener';

export interface PotConfigProviderProps {
  prefixCls: ComputedRef<string>;
  theme: ComputedRef<'dark' | 'light'>;
  menuMode: ComputedRef<MenuMode>;
  headerMix: ComputedRef<boolean>;
  footer: ComputedRef<boolean>;
  trigger: ComputedRef<TriggerPlacement>;
  collapsed: Ref<boolean>;
  isMobile: Ref<boolean>;

  hasSidebar: ComputedRef<boolean>;
}

export interface PotHookProviderProps extends Record<string, any> {
  toggleSidebar: () => void;
  isFullHeader: ComputedRef<boolean>;
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
    isFullHeader: computed((): boolean => !props.headerMix.value),
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
