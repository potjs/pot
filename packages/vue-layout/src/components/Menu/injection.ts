import type { ComputedRef, InjectionKey } from 'vue';
import { inject, provide } from 'vue';
import { MenuOptions, RenderLabelWithMenu } from './types';

export interface AjsMenuProviderProps extends Record<string, any> {
  options: ComputedRef<MenuOptions[]>;
  mode: ComputedRef<string>;
  renderLabel: ComputedRef<RenderLabelWithMenu>;
  collapsed: ComputedRef<boolean>;
  indent: ComputedRef<number>;
}

export const AjsMenuProviderKey: InjectionKey<AjsMenuProviderProps> = Symbol('AjsMenuProvider');

export const useMenuProvide = (state: AjsMenuProviderProps) => {
  provide(AjsMenuProviderKey, state);
};

export const useMenuInject = () => {
  return inject(AjsMenuProviderKey) as AjsMenuProviderProps;
};
