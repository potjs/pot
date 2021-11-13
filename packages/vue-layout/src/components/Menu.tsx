import type { Plugin, App, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';

import type { MenuOptions, RenderLabelWithMenu, Theme } from '../types';
import { PotMenuProviderProps, useMenuProvide } from '../injection';
import { treeFindPath } from '../utils';

import { MenuItem } from './Menu/MenuItem';
import { Submenu } from './Menu/Submenu';

const labelRenderer: RenderLabelWithMenu = (menu) => menu.label;

export const menuProps = {
  options: {
    type: Array as PropType<MenuOptions[]>,
    default: () => [],
  },
  mode: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'vertical',
  },
  renderLabel: {
    type: Function as PropType<RenderLabelWithMenu>,
    default: labelRenderer,
  },
  collapsed: {
    type: Boolean,
    default: false,
  },
  indent: {
    type: Number,
    default: 24,
  },
  indexKey: {
    type: String,
    default: 'key',
  },
  theme: {
    type: String as PropType<keyof Theme>,
    default: '',
  },
  active: {
    type: String,
    default: '',
  },
};

export type PotMenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

const themes: Theme = {
  dark: 'dark',
  light: 'light',
};

/**
 * Menu component
 * @example
 * <PotMenu :active="" :options="menuTree" theme="dark" mode="vertical" >
 *   <template #default="{ item }"></template>
 * </PotMenu>
 */
const Menu = defineComponent({
  name: 'PotMenu',
  props: menuProps,
  emits: ['click', 'update:active'],
  setup(props, { slots, emit }) {
    const configProvider: PotMenuProviderProps = {
      options: computed(() => props.options),
      mode: computed(() => props.mode),
      renderLabel: computed(() => props.renderLabel),
      collapsed: computed(() => props.collapsed),
      indent: computed(() => props.indent),
      indexKey: computed(() => props.indexKey),
      theme: computed(() => props.theme),
      active: computed(() => props.active),
      activePaths: computed(() => {
        return treeFindPath(
          props.options,
          (t) => t[props.indexKey] === props.active,
          props.indexKey,
        );
      }),

      rootSlots: computed(() => slots),
    };

    useMenuProvide(configProvider);

    const { options, collapsed } = toRefs(props);

    const getProps = computed(() => {
      return {
        onClick: (...args: any[]) => emit('click', ...args),
      };
    });

    const className = computed(() => ({
      [`pot-menu`]: true,
      [`collapsed`]: collapsed.value,
      [`pot-menu-${themes[props.theme]}`]: true,
    }));

    return () => (
      <ul class={className.value}>
        {options.value.map((item) => {
          return (
            <>
              {!item.children && <MenuItem menuInfo={item} {...getProps.value} />}
              {item.children && <Submenu menuInfo={item} {...getProps.value} />}
            </>
          );
        })}
      </ul>
    );
  },
});

Menu.install = function (app: App) {
  app.component(Menu.name, Menu);
  return app;
};

export default Menu as typeof Menu & Plugin;
