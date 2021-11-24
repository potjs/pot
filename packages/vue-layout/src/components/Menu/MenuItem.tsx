import type { PropType } from 'vue';
import { computed, CSSProperties, defineComponent, toRefs } from 'vue';
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
      default: 0,
    },
  },
  setup(props) {
    const { prefixCls, menuIndent, menuKey, menuActive, renderMenuLabel } = useInjectSettings();
    const { onMenuSelect } = useInjectShared();
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
          class={[`${prefixCls.value}-menu-item`, { [`active`]: menuActive.value === index }]}
          style={getStyles.value}
          data-menu-index={index}
          onClick={() => onMenuSelect(index, menuInfo.value)}
        >
          <span class={`${prefixCls.value}-menu-item--icon`}>🙄</span>
          <span class={`${prefixCls.value}-menu-item--label`}>
            {renderMenuLabel.value(menuInfo.value)}
          </span>
        </li>
      </>
    );
  },
});
