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
    const {
      isMobile,
      isCollapsed,
      isMenuInHeader,
      getMenuActivePaths,
      getMenuOpened,
      onMenuOpen,
      getSlots,
    } = useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const slots = getSlots(['renderMenuIcon', 'renderMenuLabel']);
    const getCollapsed = computed(() => !isMobile.value && isCollapsed.value);
    const hasMenuIndent = computed(() => !isMenuInHeader.value && !isCollapsed.value);
    const hasCollapseMotion = computed(() => !isMenuInHeader.value && !isCollapsed.value);
    const firstNode = computed(() => depth.value === 1);

    const index = menuInfo.value[menuKey.value];
    const getActive = computed(() => getMenuActivePaths.value.includes(index));
    // show or hide submenu list
    const isOpened = computed(() => getMenuOpened.value.includes(index));

    const renderItemInner = () => {
      return createVNode(
        isMenuInHeader.value ? 'div' : Fragment,
        { class: `${prefixCls.value}-menu-submenu-content` },
        [
          slots.renderMenuIcon &&
            createVNode('span', { class: `${prefixCls.value}-menu-icon` }, [
              slots.renderMenuIcon(menuInfo.value),
            ]),
          createVNode('span', { class: `${prefixCls.value}-menu-label` }, [
            slots.renderMenuLabel?.(menuInfo.value),
          ]),
          createVNode('i', { class: `${prefixCls.value}-menu-submenu-arrow` }),
        ],
      );
    };

    const renderItem = (inner: VNode) => {
      return createVNode(
        'div',
        {
          class: `${prefixCls.value}-menu-submenu-title`,
          ...(hasMenuIndent.value && {
            style: {
              paddingLeft: menuIndent.value * depth.value + 'px',
            },
          }),
          ...(hasCollapseMotion.value && {
            onClick: () => onMenuOpen(index, menuInfo.value),
          }),
        },
        [inner],
      );
    };

    const renderMenu = () => {
      const getProps = computed(() => {
        return {
          depth: depth.value + 1,
        };
      });

      const children = computed(() => menuInfo.value.children || []);
      const getShow = computed(
        () => getCollapsed.value || isMenuInHeader.value || (isOpened.value && !getCollapsed.value),
      );

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
      if (getCollapsed.value || isMenuInHeader.value) {
        return createVNode(
          Popper,
          {
            class: `${prefixCls.value}-menu-popper`,
            trigger: 'hover',
            placement: isMenuInHeader.value && firstNode.value ? 'bottom-start' : 'right-start',
            appendToBody: firstNode.value,
            transition: 'pot-fade',
            showAfter: 200,
          },
          {
            default: () => childNodes[0],
            content: () => childNodes[1],
          },
        );
      }
      return createVNode(Fragment, null, childNodes);
    };

    return () =>
      createVNode(
        'li',
        {
          class: [
            `${prefixCls.value}-menu-submenu`,
            {
              [`${prefixCls.value}-menu-submenu-active`]: getActive.value,
              [`${prefixCls.value}-menu-submenu-opened`]: !getCollapsed.value && isOpened.value,
              [`${prefixCls.value}-menu-submenu-closed`]: !getCollapsed.value && !isOpened.value,
            },
          ],
        },
        [
          isMenuInHeader.value && firstNode.value
            ? renderItem(renderContent([renderItemInner(), renderMenu()]))
            : renderContent([renderItem(renderItemInner()), renderMenu()]),
        ],
      );
  },
});
