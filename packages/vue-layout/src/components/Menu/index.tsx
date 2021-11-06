import type { Plugin, App, CSSProperties } from 'vue';
import {
  defineComponent,
  ExtractPropTypes,
  toRefs,
  PropType,
  computed,
  ref,
  createVNode,
} from 'vue';

import type { MenuOptions, RenderLabelWithMenu } from './types';
import { useCssModules } from '../../hooks/useCss';
import { AjsMenuProviderProps, useMenuProvide, useMenuInject } from './injection';

const {
  menuCls,
  menuItemCls,
  submenuCls,
  submenuInnerCls,
  menuItemIconCls,
  menuItemLabelCls,
  menuItemTriggerCls,
  collapsedCls,
  submenuContentCls,
} = useCssModules();

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
};

export type AjsMenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

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
      type: String,
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
    // resolveComponent('router-link')
    return () =>
      createVNode(
        props.tagName,
        {
          class: props.className,
          ...(!props.inner && {
            'data-menu-index': props.index,
          }),
        },
        [slots.default?.(), props.inner && createVNode('span', { class: menuItemTriggerCls })],
      );
  },
});

/**
 * Menu component
 * @example
 * <AjsMenu :active="" :options="menuTree" theme="dark" mode="vertical" >
 *   <template #default="{ item }">
 *     <AjsMenu.ItemIcon>😊</AjsMenu.ItemIcon>
 *     <AjsMenu.ItemLabel>{{ item.label }}</AjsMenu.ItemLabel>
 *   </template>
 * </AjsMenu>
 */
const Menu = defineComponent({
  name: 'AjsMenu',
  props: menuProps,
  emits: ['click'],
  setup(props, { slots, emit }) {
    const configProvider: AjsMenuProviderProps = {
      options: computed(() => props.options),
      mode: computed(() => props.mode),
      renderLabel: computed(() => props.renderLabel),
      collapsed: computed(() => props.collapsed),
      indent: computed(() => props.indent),
      indexKey: computed(() => props.indexKey),

      rootSlots: computed(() => slots),
    };

    useMenuProvide(configProvider);

    const { options, collapsed } = toRefs(props);

    const getProps = computed(() => {
      return {
        onClick: (...args: any[]) => emit('click', ...args),
      };
    });

    return () => (
      <ul class={[menuCls, { [collapsedCls]: collapsed.value }]}>
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
  name: 'AjsMenuItem',
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
        className: menuItemCls,
        index,
        onClick: () => emit('click', index, menuInfo.value),
      });
  },
});

const SubMenu = defineComponent({
  name: 'AjsSubMenu',
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
    const { collapsed, indexKey } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const children = computed(() => menuInfo.value.children || []);
    const show = ref(false);
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

    return () => (
      <li class={submenuCls} data-submenu-index={menuInfo.value[indexKey.value]}>
        {renderItem(menuInfo.value, depth.value, {
          tagName: 'div',
          class: submenuInnerCls,
          inner: true,
          onClick: toggle,
        })}
        <ul class={[menuCls, submenuContentCls]} style={getContentStyles.value}>
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
  name: 'AjsMenuItemIcon',
  setup(props, { slots }) {
    return () => <span class={menuItemIconCls}>{slots.default?.({})}</span>;
  },
});

const ItemLabel = defineComponent({
  name: 'AjsMenuItemLabel',
  setup(props, { slots }) {
    return () => <span class={menuItemLabelCls}>{slots.default?.({})}</span>;
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
