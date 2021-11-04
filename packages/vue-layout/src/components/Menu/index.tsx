import type { Plugin, App, CSSProperties } from 'vue';
import { defineComponent, ExtractPropTypes, toRefs, PropType, computed, ref } from 'vue';

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
    const configProvider: AjsMenuProviderProps = {
      options: computed(() => props.options),
      mode: computed(() => props.mode),
      renderLabel: computed(() => props.renderLabel),
      collapsed: computed(() => props.collapsed),
      indent: computed(() => props.indent),
    };

    useMenuProvide(configProvider);

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
  setup(props) {
    const { renderLabel, indent } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: indent.value * depth.value + 'px',
      };
    });

    return () => (
      <li class={menuItemCls} style={getStyles.value}>
        <span class={menuItemIconCls}>😊</span>
        <span class={menuItemLabelCls}>{renderLabel.value(menuInfo.value)}</span>
      </li>
    );
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
  setup(props) {
    const { renderLabel } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const getProps = computed(() => ({
      depth: depth.value + 1,
    }));

    const getInnerStyles = computed(
      (): CSSProperties => ({
        paddingLeft: 24 * depth.value + 'px',
      }),
    );

    const children = computed(() => menuInfo.value.children || []);
    const show = ref(false);
    const toggle = () => {
      show.value = !show.value;
    };

    const getContentStyles = computed((): CSSProperties => {
      return {
        ...(!show.value && {
          display: 'none',
        }),
      };
    });

    return () => (
      <li class={submenuCls}>
        <div class={submenuInnerCls} style={getInnerStyles.value} onClick={toggle}>
          <span class={menuItemIconCls}>😊</span>
          <span class={menuItemLabelCls}>{renderLabel.value(menuInfo.value)}</span>
          <span class={menuItemTriggerCls} />
        </div>
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

Menu.install = function (app: App) {
  app.component(Menu.name, Menu);
  return app;
};

export default Menu as typeof Menu & Plugin;
