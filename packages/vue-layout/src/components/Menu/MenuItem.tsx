import type { PropType } from 'vue';
import { computed, createVNode, defineComponent, toRefs } from 'vue';
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
    const { onMenuSelect, isMobile, isCollapsed, getSlots } = useInjectShared();
    const { menuInfo, depth } = toRefs(props);
    const slots = getSlots(['renderMenuIcon', 'renderMenuLabel']);

    const index = menuInfo.value[menuKey.value];
    const getCollapsed = computed(() => !isMobile.value && isCollapsed.value);

    const className = `${prefixCls.value}-menu-item`;

    return () =>
      createVNode(
        'li',
        {
          class: [className, { [`${className}-active`]: menuActive.value === index }],
          'data-menu-index': index,
          ...(!getCollapsed.value && {
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
