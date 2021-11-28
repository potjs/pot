import type { PropType, VNode } from 'vue';
import { computed, createVNode, defineComponent, toRefs, Fragment, Transition } from 'vue';
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
    const { isMobile, isCollapsed, getMenuActivePaths, getMenuOpened, onMenuOpen } =
      useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const getCollapsed = computed(() => !isMobile.value && isCollapsed.value);

    const index = menuInfo.value[menuKey.value];
    const getActive = computed(() => getMenuActivePaths.value.includes(index));
    // show or hide submenu list
    const show = computed(() => getMenuOpened.value.includes(index));

    const renderInner = () => {
      return createVNode(
        'div',
        {
          class: `${prefixCls.value}-submenu-item`,
          ...(!getCollapsed.value && {
            style: {
              paddingLeft: menuIndent.value * depth.value + 'px',
            },
            onClick: () => onMenuOpen(index, menuInfo.value),
          }),
        },
        [
          createVNode('span', { class: `${prefixCls.value}-menu-item--icon` }, ['🙄']),
          createVNode('span', { class: `${prefixCls.value}-menu-item--label` }, [
            renderMenuLabel.value(menuInfo.value),
          ]),
          createVNode('i', { class: `${prefixCls.value}-submenu-trigger` }),
        ],
      );
    };

    const renderMenu = () => {
      const getProps = computed(() => {
        return {
          depth: depth.value + 1,
        };
      });

      const children = computed(() => menuInfo.value.children || []);
      const getShow = computed(() => getCollapsed.value || (show.value && !getCollapsed.value));

      return (
        <Transition name={'pot-collapse'}>
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
        </Transition>
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

    return () =>
      createVNode(
        'li',
        {
          class: [
            `${prefixCls.value}-submenu`,
            {
              [`${prefixCls.value}-submenu-active`]: getActive.value,
              [`${prefixCls.value}-submenu-opened`]: show.value,
            },
          ],
        },
        [renderContent([renderInner(), renderMenu()])],
      );
  },
});
