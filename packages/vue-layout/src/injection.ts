import type { ComputedRef, InjectionKey, Slots } from 'vue';
import { inject, provide } from 'vue';
import { MenuOptions, RenderLabelWithMenu, Theme } from './types';

export interface PotMenuProviderProps {
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

export const PotMenuProviderKey: InjectionKey<PotMenuProviderProps> = Symbol('PotMenuProvider');

export const useMenuProvide = (state: PotMenuProviderProps) => {
  provide(PotMenuProviderKey, state);
};

export const useMenuInject = () => {
  return inject(PotMenuProviderKey) as PotMenuProviderProps;
};
