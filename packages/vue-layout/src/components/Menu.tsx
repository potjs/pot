import type { PropType } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';

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
  },
  setup(props) {
    const { options } = toRefs(props);
    const { prefixCls } = useInjectSettings();
    const { isCollapsed } = useInjectShared();

    const className = computed(() => ({
      [`${prefixCls.value}-menu`]: true,
      [`${prefixCls.value}-menu-collapsed`]: isCollapsed.value,
    }));

    return () => (
      <ul class={className.value}>
        {options.value.map((item) => {
          return (
            <>
              {!item.children && <MenuItem menuInfo={item} />}
              {item.children && <Submenu menuInfo={item} />}
            </>
          );
        })}
      </ul>
    );
  },
});
