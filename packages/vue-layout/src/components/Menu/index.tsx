import type { Plugin, App, CSSProperties, PropType, ExtractPropTypes } from 'vue';
import { defineComponent, toRefs, computed, ref, createVNode } from 'vue';

import type { MenuOptions, RenderLabelWithMenu, Theme } from './types';
import { PotMenuProviderProps, useMenuProvide, useMenuInject } from './injection';
import { treeFindPath } from '../../utils';

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

// render icon and label for item
const renderItem = (menuInfo: MenuOptions, depth: number, attr: object) => {
  const { renderLabel, rootSlots, indent } = useMenuInject();

  const getStyles = computed((): CSSProperties => {
    return {
      paddingLeft: indent.value * depth + 'px',
    };
  });

  return (
    <BaseMenuItem style={getStyles.value} {...attr}>
      {rootSlots.value.item ? (
        rootSlots.value.item?.({ item: menuInfo })
      ) : (
        <>
          {/*<ItemIcon></ItemIcon>*/}
          <ItemLabel>{renderLabel.value(menuInfo)}</ItemLabel>
        </>
      )}
    </BaseMenuItem>
  );
};

const BaseMenuItem = defineComponent({
  props: {
    tagName: {
      type: String,
      default: 'li',
    },
    className: {
      type: [String, Array] as PropType<string | any[]>,
      default: '',
    },
    inner: {
      type: Boolean,
      default: false,
    },
    index: {
      type: String,
      default: '',
    },
  },
  setup(props, { slots }) {
    const { active } = useMenuInject();
    // resolveComponent('router-link')
    return () =>
      createVNode(
        props.tagName,
        {
          class: [props.className, { [`active`]: active.value === props.index }],
          ...(!props.inner && {
            'data-menu-index': props.index,
          }),
        },
        [
          slots.default?.(),
          props.inner && createVNode('span', { class: `pot-menu-item--trigger` }),
        ],
      );
  },
});

/**
 * Menu component
 * @example
 * <PotMenu :active="" :options="menuTree" theme="dark" mode="vertical" >
 *   <template #default="{ item }">
 *     <PotMenu.ItemIcon>😊</PotMenu.ItemIcon>
 *     <PotMenu.ItemLabel>{{ item.label }}</PotMenu.ItemLabel>
 *   </template>
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
              {item.children && <SubMenu menuInfo={item} {...getProps.value} />}
            </>
          );
        })}
      </ul>
    );
  },
});

const MenuItem = defineComponent({
  name: 'PotMenuItem',
  props: {
    menuInfo: {
      type: Object as PropType<MenuOptions>,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { indexKey } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const index = menuInfo.value[indexKey.value];
    return () =>
      renderItem(menuInfo.value, depth.value, {
        tagName: 'li',
        className: `pot-menu-item`,
        index,
        onClick: () => emit('click', index, menuInfo.value),
      });
  },
});

const SubMenu = defineComponent({
  name: 'PotSubMenu',
  props: {
    menuInfo: {
      type: Object as PropType<MenuOptions>,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { collapsed, indexKey, activePaths } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const children = computed(() => menuInfo.value.children || []);
    const index = menuInfo.value[indexKey.value];
    const getActive = computed(() => activePaths.value.includes(index));
    // show or hide submenu list
    const show = ref(getActive.value);
    const toggle = () => {
      show.value = !show.value;
    };

    const getContentStyles = computed((): CSSProperties => {
      const getShow = !show.value || collapsed.value;
      return {
        ...(getShow && {
          display: 'none',
        }),
      };
    });

    const getProps = computed(() => {
      return {
        depth: depth.value + 1,
        onClick: (...args: any[]) => emit('click', ...args),
      };
    });

    const className = computed(() => ({
      [`pot-menu-submenu`]: true,
      [`active`]: getActive.value,
    }));

    return () => (
      <li class={className.value} data-submenu-index={index}>
        {renderItem(menuInfo.value, depth.value, {
          tagName: 'div',
          className: [`pot-menu-submenu-item`, { [`active`]: getActive.value }],
          inner: true,
          onClick: toggle,
        })}
        <ul class={[`pot-menu`, `pot-menu-submenu-content`]} style={getContentStyles.value}>
          {children.value.map((item) => {
            return (
              <>
                {!item.children && <MenuItem menuInfo={item} {...getProps.value} />}
                {item.children && <SubMenu menuInfo={item} {...getProps.value} />}
              </>
            );
          })}
        </ul>
      </li>
    );
  },
});

const ItemIcon = defineComponent({
  name: 'PotMenuItemIcon',
  setup(props, { slots }) {
    return () => <span class={`pot-menu-item--icon`}>{slots.default?.({})}</span>;
  },
});

const ItemLabel = defineComponent({
  name: 'PotMenuItemLabel',
  setup(props, { slots }) {
    return () => <span class={`pot-menu-item--label`}>{slots.default?.({})}</span>;
  },
});

Menu.install = function (app: App) {
  app.component(Menu.name, Menu);
  app.component(ItemIcon.name, ItemIcon);
  app.component(ItemLabel.name, ItemLabel);
  return app;
};

Menu.ItemIcon = ItemIcon;
Menu.ItemLabel = ItemLabel;

export default Menu as typeof Menu &
  Plugin & {
    readonly ItemIcon: typeof ItemIcon;
    readonly ItemLabel: typeof ItemLabel;
  };
