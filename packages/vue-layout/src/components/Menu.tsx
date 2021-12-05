import type { PropType } from 'vue';
import { defineComponent, toRefs, createVNode, Fragment } from 'vue';

import type { MenuRaw } from '../defaultSettings';

import { MenuItem } from './Menu/MenuItem';
import { Submenu } from './Menu/Submenu';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export const Menu = defineComponent({
  name: 'PotMenu',
  props: {
    options: {
      type: Array as PropType<MenuRaw[]>,
      default: () => [],
    },
    horizontal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { options } = toRefs(props);
    const { prefixCls } = useInjectSettings();
    const { isCollapsed } = useInjectShared();

    return () =>
      createVNode(
        'ul',
        {
          class: [
            `${prefixCls.value}-menu`,
            {
              [`${prefixCls.value}-menu-horizontal`]: props.horizontal,
              [`${prefixCls.value}-menu-collapsed`]: isCollapsed.value,
            },
          ],
        },
        options.value.map((item) =>
          createVNode(Fragment, null, [
            !item.children && createVNode(MenuItem, { menuInfo: item }),
            item.children && createVNode(Submenu, { menuInfo: item }),
          ]),
        ),
      );
  },
});
