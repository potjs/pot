import type { PropType } from 'vue';
import { createVNode, defineComponent, toRefs, computed } from 'vue';
import { MenuRaw } from '../../defaultSettings';
import { useInjectSettings, useInjectShared } from '../../hooks/injection';

export const MenuItem = defineComponent({
  name: 'PotMenuItem',
  props: {
    menuInfo: {
      type: Object as PropType<MenuRaw>,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 1,
    },
  },
  setup(props) {
    const { prefixCls, menuIndent, menuKey, menuActive } = useInjectSettings();
    const { onMenuSelect, isMenuInHeader, isCollapsed, getSlots } = useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const slots = getSlots(['renderMenuIcon', 'renderMenuLabel']);
    const hasMenuIndent = computed(() => !isMenuInHeader.value && !isCollapsed.value);

    const index = menuInfo.value[menuKey.value];

    return () =>
      createVNode(
        'li',
        {
          class: [
            `${prefixCls.value}-menu-item`,
            { [`${prefixCls.value}-menu-item-active`]: menuActive.value === index },
          ],
          'data-menu-index': index,
          ...(hasMenuIndent.value && {
            style: {
              paddingLeft: menuIndent.value * depth.value + 'px',
            },
          }),
          onClick: () => onMenuSelect(index, menuInfo.value),
        },
        [
          slots.renderMenuIcon &&
            createVNode('span', { class: `${prefixCls.value}-menu-icon` }, [
              slots.renderMenuIcon(menuInfo.value),
            ]),
          createVNode('span', { class: `${prefixCls.value}-menu-label` }, [
            slots.renderMenuLabel?.(menuInfo.value),
          ]),
        ],
      );
  },
});
