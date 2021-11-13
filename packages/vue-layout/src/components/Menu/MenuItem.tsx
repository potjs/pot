import type { PropType } from 'vue';
import { computed, CSSProperties, defineComponent, toRefs } from 'vue';
import { MenuRaw } from '../../types';
import { useInjectConfig } from '../../hooks';

export const MenuItem = defineComponent({
  name: 'PotMenuItem',
  props: {
    menuInfo: {
      type: Object as PropType<MenuRaw>,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const { menuIndent, menuKey, menuActive, renderMenuLabel, onMenuSelect } = useInjectConfig();
    const { menuInfo, depth } = toRefs(props);

    const index = menuInfo.value[menuKey.value];

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: menuIndent.value * depth.value + 'px',
      };
    });

    return () => (
      <>
        <li
          class={[`pot-menu-item`, { [`active`]: menuActive.value === index }]}
          style={getStyles.value}
          data-menu-index={index}
          onClick={() => onMenuSelect(index, menuInfo.value)}
        >
          <span class={`pot-menu-item--icon`}>🙄</span>
          <span class={`pot-menu-item--label`}>{renderMenuLabel.value(menuInfo.value)}</span>
        </li>
      </>
    );
  },
});
