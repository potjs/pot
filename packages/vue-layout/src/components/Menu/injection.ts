import type { ComputedRef, InjectionKey, Slots } from 'vue';
import { inject, provide } from 'vue';
import { MenuOptions, RenderLabelWithMenu, Theme } from './types';

export interface AjsMenuProviderProps {
  options: ComputedRef<MenuOptions[]>;
  mode: ComputedRef<string>;
  renderLabel: ComputedRef<RenderLabelWithMenu>;
  collapsed: ComputedRef<boolean>;
  indent: ComputedRef<number>;
  indexKey: ComputedRef<string>;
  theme: ComputedRef<keyof Theme>;
  active: ComputedRef<string>;
  activePaths: ComputedRef<string[]>;

  rootSlots: ComputedRef<Slots>;
}

export const AjsMenuProviderKey: InjectionKey<AjsMenuProviderProps> = Symbol('AjsMenuProvider');

export const useMenuProvide = (state: AjsMenuProviderProps) => {
  provide(AjsMenuProviderKey, state);
};

export const useMenuInject = () => {
  return inject(AjsMenuProviderKey) as AjsMenuProviderProps;
};
