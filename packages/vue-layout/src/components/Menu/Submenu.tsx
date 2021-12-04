import type { PropType, VNode } from 'vue';
import { computed, createVNode, defineComponent, toRefs, Fragment, Transition, ref } from 'vue';
import { MenuRaw } from '../../defaultSettings';

import { MenuItem } from './MenuItem';
import Popper from '@potjs/vue-popper';
import { useInjectSettings, useInjectShared } from '../../hooks/injection';
import { useCollapseTransition } from '../../hooks/transition';

export const Submenu = defineComponent({
  name: 'PotSubmenu',
  props: {
    menuInfo: {
      type: Object as PropType<MenuRaw>,
      required: true,
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { prefixCls, menuIndent, menuKey } = useInjectSettings();
    const { isMobile, isCollapsed, getMenuActivePaths, getMenuOpened, onMenuOpen, getSlots } =
      useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const getCollapsed = computed(() => !isMobile.value && isCollapsed.value);
    const slots = getSlots(['renderMenuIcon', 'renderMenuLabel']);

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
          slots.renderMenuIcon &&
            createVNode('span', { class: `${prefixCls.value}-menu-icon` }, [
              slots.renderMenuIcon(menuInfo.value),
            ]),
          createVNode('span', { class: `${prefixCls.value}-menu-label` }, [
            slots.renderMenuLabel?.(menuInfo.value),
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

      const style = ref({});
      const className = ref('');
      return (
        <Transition {...useCollapseTransition(style, className)}>
          <ul
            v-show={getShow.value}
            class={[`${prefixCls.value}-menu`, className.value]}
            style={style.value}
          >
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
              appendToBody: depth.value === 1,
              transition: 'pot-fade-in-linear',
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
