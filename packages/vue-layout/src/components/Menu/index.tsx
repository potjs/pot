import type { Plugin, App, CSSProperties } from 'vue';
import { defineComponent, ExtractPropTypes, toRefs, PropType, computed } from 'vue';

import { useCssModules } from '../../hooks/useCss';
const {
  menuCls,
  menuItemCls,
  submenuCls,
  submenuInnerCls,
  menuItemIconCls,
  menuItemLabelCls,
  menuItemTriggerCls,
  collapsedCls,
} = useCssModules();

export interface MenuItem {
  label: string;
  icon?: string;
  key?: string;
  disabled?: boolean;
  children?: MenuItem[];
}

export interface RenderLabelWithMenu {
  (item: MenuItem): string | HTMLElement;
}

const labelRenderer: RenderLabelWithMenu = (menu) => menu.label;

export const menuProps = {
  width: {
    type: String,
    default: '200px',
  },
  options: {
    type: Array as PropType<MenuItem[]>,
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
};

export type AjsMenuProps = Partial<ExtractPropTypes<typeof menuProps>>;

/**
 * Menu component
 * @example
 * <Menu :active="" :options="menuTree" theme="dark" mode="vertical" >
 *   <template #default>
 *     <Icon />
 *     <Label />
 *   </template>
 * </Menu>
 */
const Menu = defineComponent({
  name: 'AjsMenu',
  props: menuProps,
  setup(props) {
    const { options, collapsed } = toRefs(props);

    const getProps = computed(() => {
      return {
        renderLabel: props.renderLabel,
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

export const MenuItem = defineComponent({
  name: 'AjsMenuItem',
  props: {
    menuInfo: {
      type: Object as PropType<MenuItem>,
      default: () => {},
    },
    renderLabel: {
      type: Function as PropType<RenderLabelWithMenu>,
      default: labelRenderer,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { menuInfo, depth } = toRefs(props);

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: 24 * depth.value + 'px',
      };
    });

    return () => (
      <li class={menuItemCls} style={getStyles.value}>
        <span class={menuItemIconCls}>😊</span>
        <span class={menuItemLabelCls}>{props.renderLabel(menuInfo.value)}</span>
      </li>
    );
  },
});

export const SubMenu = defineComponent({
  name: 'AjsSubMenu',
  props: {
    menuInfo: {
      type: Object as PropType<MenuItem>,
      default: () => {},
    },
    renderLabel: {
      type: Function as PropType<RenderLabelWithMenu>,
      default: labelRenderer,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { menuInfo, depth } = toRefs(props);

    const getProps = computed(() => {
      return {
        renderLabel: props.renderLabel,
        depth: depth.value + 1,
      };
    });

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: 24 * depth.value + 'px',
      };
    });

    return () => (
      <li class={submenuCls}>
        <div class={submenuInnerCls} style={getStyles.value}>
          <span class={menuItemIconCls}>😊</span>
          <span class={menuItemLabelCls}>{props.renderLabel(menuInfo.value)}</span>
          <span class={menuItemTriggerCls} />
        </div>
        <ul class={menuCls}>
          {menuInfo.value.children &&
            menuInfo.value.children.map((item) => {
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

Menu.install = function (app: App) {
  app.component(Menu.name, Menu);
  return app;
};

export default Menu as typeof Menu & Plugin;
