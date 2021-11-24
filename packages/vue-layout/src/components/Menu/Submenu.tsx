import type { CSSProperties, PropType, VNode } from 'vue';
import { computed, createVNode, defineComponent, ref, toRefs, Fragment } from 'vue';
import { MenuRaw } from '../../defaultSettings';

import { MenuItem } from './MenuItem';
import Popper from '@potjs/vue-popper';
import { useInjectSettings, useInjectShared } from '../../hooks/injection';

export const Submenu = defineComponent({
  name: 'PotSubmenu',
  props: {
    menuInfo: {
      type: Object as PropType<MenuRaw>,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { prefixCls, menuIndent, menuKey, renderMenuLabel } = useInjectSettings();
    const { isMobile, isCollapsed, getMenuActivePaths } = useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const getCollapsed = computed(() => !isMobile.value && isCollapsed.value);

    const index = menuInfo.value[menuKey.value];
    const getActive = computed(() => getMenuActivePaths.value.includes(index));
    // show or hide submenu list
    const show = ref(getActive.value);
    const toggle = () => {
      show.value = !show.value;
    };

    const getProps = computed(() => {
      return {
        depth: depth.value + 1,
      };
    });

    const className = computed(() => ({
      [`${prefixCls.value}-menu-submenu`]: true,
      [`active`]: getActive.value,
    }));

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: menuIndent.value * props.depth + 'px',
      };
    });

    const renderInner = () => {
      return (
        <div
          class={[`${prefixCls.value}-menu-submenu-item`, { [`active`]: getActive.value }]}
          style={getStyles.value}
          onClick={toggle}
        >
          <span class={`${prefixCls.value}-menu-item--icon`}>🙄</span>
          <span class={`${prefixCls.value}-menu-item--label`}>
            {renderMenuLabel.value(menuInfo.value)}
          </span>
          <span class={`${prefixCls.value}-menu-item--trigger`} />
        </div>
      );
    };

    const renderMenu = () => {
      const children = computed(() => menuInfo.value.children || []);
      const getShow = computed(() => getCollapsed.value || (show.value && !getCollapsed.value));

      return (
        <ul class={[`${prefixCls.value}-menu`]} v-show={getShow.value}>
          {children.value.map((item) => {
            return (
              <>
                {!item.children && <MenuItem menuInfo={item} {...getProps.value} />}
                {item.children && <Submenu menuInfo={item} {...getProps.value} />}
              </>
            );
          })}
        </ul>
      );
    };

    const renderContent = (childNodes: VNode[]) => {
      return getCollapsed.value
        ? createVNode(
            Popper,
            {
              class: `${prefixCls.value}-menu-popper`,
              trigger: 'hover',
              placement: 'right-start',
              appendToBody: depth.value === 0,
            },
            {
              default: () => childNodes[0],
              content: () => childNodes[1],
            },
          )
        : createVNode(Fragment, null, childNodes);
    };

    return () => (
      <li class={className.value} data-submenu-index={index}>
        {renderContent([renderInner(), renderMenu()])}
      </li>
    );
  },
});
