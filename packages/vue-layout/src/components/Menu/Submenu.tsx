import type { CSSProperties, PropType, VNode } from 'vue';
import { computed, createVNode, defineComponent, ref, toRefs, Fragment } from 'vue';
import { MenuRaw } from '../../types';

import { MenuItem } from './MenuItem';
import { useInjectConfig } from '../../hooks';
import Popper from '@potjs/vue-popper';

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
    const { collapsed, isMobile, menuIndent, menuKey, menuActivePaths, renderMenuLabel } =
      useInjectConfig();
    const { menuInfo, depth } = toRefs(props);
    const getCollapsed = computed(() => !isMobile.value && collapsed.value);

    const index = menuInfo.value[menuKey.value];
    const getActive = computed(() => menuActivePaths.value.includes(index));
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
      [`pot-menu-submenu`]: true,
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
          class={[`pot-menu-submenu-item`, { [`active`]: getActive.value }]}
          style={getStyles.value}
          onClick={toggle}
        >
          <span class={`pot-menu-item--icon`}>🙄</span>
          <span class={`pot-menu-item--label`}>{renderMenuLabel.value(menuInfo.value)}</span>
          <span class={`pot-menu-item--trigger`} />
        </div>
      );
    };

    const renderMenu = () => {
      const children = computed(() => menuInfo.value.children || []);
      const getShow = computed(() => getCollapsed.value || (show.value && !getCollapsed.value));

      return (
        <ul class={[`pot-menu`]} v-show={getShow.value}>
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
              class: 'pot-menu-popper',
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
