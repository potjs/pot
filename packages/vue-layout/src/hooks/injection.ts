import type { InjectionKey, ToRefs, SetupContext } from 'vue';

import { computed, inject, provide, reactive, toRefs } from 'vue';
import { LayoutSettings, LayoutShared, EmitType, MenuMode } from '../defaultSettings';
import { extendSlots, treeFindPath } from '../utils';

export const InjectSettingsKey: InjectionKey<LayoutSettings> = Symbol('PotInjectSettingsKey');
export const useProvideSettings = (state: LayoutSettings) => {
  provide(InjectSettingsKey, state);
};
export const useInjectSettings = (): ToRefs<LayoutSettings> => {
  return toRefs(inject(InjectSettingsKey) as LayoutSettings);
};

export const InjectSharedKey: InjectionKey<LayoutShared> = Symbol('PotInjectSharedKey');
export const useProvideShared = (
  props: LayoutSettings,
  { emit, slots }: SetupContext<EmitType[]>,
) => {
  const state = reactive({
    collapsed: false,
    mobile: false,
    menuOpened: new Set<string>(
      treeFindPath(props.menuData, (t) => t[props.menuKey] === props.menuActive, props.menuKey),
    ),
  });

  provide(InjectSharedKey, {
    hasSidebar: computed((): boolean => props.menuMode !== MenuMode.TOP),
    isMenuInHeader: computed(
      () => props.menuMode === MenuMode.TOP && props.menuData.length > 0 && !state.mobile,
    ),
    isFullHeader: computed(
      (): boolean => props.menuMode === MenuMode.MIX || props.menuMode === MenuMode.MIX_SIDE,
    ),
    isCollapsed: computed(
      (): boolean => state.collapsed && (props.menuMode !== MenuMode.TOP || state.mobile),
    ),
    isMobile: computed((): boolean => state.mobile),
    getMenuActivePaths: computed(() => {
      return treeFindPath(
        props.menuData,
        (t) => t[props.menuKey] === props.menuActive,
        props.menuKey,
      );
    }),
    getMenuOpened: computed(() => [...state.menuOpened]),
    getSlots: (slotNames: string[]) => extendSlots(slots, slotNames),
    onMenuSelect: (index, menu) => {
      const paths = treeFindPath(props.menuData, (t) => t[props.menuKey] === index, props.menuKey);
      paths.forEach((p) => {
        state.menuOpened.add(p);
      });
      emit('menuSelect', index, menu);
    },
    onMenuOpen: (index) => {
      if (state.menuOpened.has(index)) {
        state.menuOpened.delete(index);
      } else {
        state.menuOpened.add(index);
      }
    },
    toggleSidebar: () => {
      state.collapsed = !state.collapsed;
    },
  });

  return state;
};
export const useInjectShared = () => {
  return inject(InjectSharedKey) as LayoutShared;
};
