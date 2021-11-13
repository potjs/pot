import type { PropType } from 'vue';
import { computed, CSSProperties, defineComponent, toRefs } from 'vue';
import { MenuOptions } from '../../types';
import { useMenuInject } from '../../injection';

export const MenuItem = defineComponent({
  name: 'PotMenuItem',
  props: {
    menuInfo: {
      type: Object as PropType<MenuOptions>,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  emits: ['click'],
  setup(props, { emit }) {
    const { indexKey, renderLabel, indent, active } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const index = menuInfo.value[indexKey.value];

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: indent.value * depth.value + 'px',
      };
    });

    return () => (
      <>
        <li
          class={[`pot-menu-item`, { [`active`]: active.value === index }]}
          style={getStyles.value}
          data-menu-index={index}
          onClick={() => emit('click', index, menuInfo.value)}
        >
          <span class={`pot-menu-item--icon`}>🙄</span>
          <span class={`pot-menu-item--label`}>{renderLabel.value(menuInfo.value)}</span>
        </li>
      </>
    );
  },
});
