import type { PropType } from 'vue';
import { defineComponent, toRefs, computed } from 'vue';

import type { MenuRaw } from '../types';

import { MenuItem } from './Menu/MenuItem';
import { Submenu } from './Menu/Submenu';
import { useInjectConfig } from '../hooks';

export const Menu = defineComponent({
  name: 'PotMenu',
  props: {
    options: {
      type: Array as PropType<MenuRaw[]>,
      default: () => [],
    },
  },
  emits: ['click'],
  setup(props) {
    const { options } = toRefs(props);
    const { collapsed } = useInjectConfig();

    const className = computed(() => ({
      [`pot-menu`]: true,
      [`collapsed`]: collapsed.value,
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
