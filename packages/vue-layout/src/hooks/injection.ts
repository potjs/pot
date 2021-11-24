import type { InjectionKey, ToRefs } from 'vue';

import { inject, provide, toRefs } from 'vue';
import { LayoutSettings, LayoutShared } from '../defaultSettings';

export const InjectSettingsKey: InjectionKey<LayoutSettings> = Symbol('PotInjectSettingsKey');
export const useProvideSettings = (state: LayoutSettings) => {
  provide(InjectSettingsKey, state);
};
export const useInjectSettings = (): ToRefs<LayoutSettings> => {
  return toRefs(inject(InjectSettingsKey) as LayoutSettings);
};

export const InjectSharedKey: InjectionKey<LayoutShared> = Symbol('PotInjectSharedKey');
export const useProvideShared = (state: LayoutShared) => {
  provide(InjectSharedKey, state);
};
export const useInjectShared = () => {
  return inject(InjectSharedKey) as LayoutShared;
};
