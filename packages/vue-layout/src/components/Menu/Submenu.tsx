import type { CSSProperties, PropType } from 'vue';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { MenuOptions } from '../../types';
import { useMenuInject } from '../../injection';

import { MenuItem } from './MenuItem';

export const Submenu = defineComponent({
  name: 'PotSubmenu',
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
    const { collapsed, indexKey, activePaths, renderLabel, indent } = useMenuInject();
    const { menuInfo, depth } = toRefs(props);

    const children = computed(() => menuInfo.value.children || []);
    const index = menuInfo.value[indexKey.value];
    const getActive = computed(() => activePaths.value.includes(index));
    // show or hide submenu list
    const show = ref(getActive.value);
    const toggle = () => {
      show.value = !show.value;
    };

    const getContentStyles = computed((): CSSProperties => {
      const getShow = !show.value || collapsed.value;
      return {
        ...(getShow && {
          display: 'none',
        }),
      };
    });

    const getProps = computed(() => {
      return {
        depth: depth.value + 1,
        onClick: (...args: any[]) => emit('click', ...args),
      };
    });

    const className = computed(() => ({
      [`pot-menu-submenu`]: true,
      [`active`]: getActive.value,
    }));

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: indent.value * props.depth + 'px',
      };
    });

    return () => (
      <li class={className.value} data-submenu-index={index}>
        <div
          class={[`pot-menu-submenu-item`, { [`active`]: getActive.value }]}
          style={getStyles.value}
          onClick={toggle}
        >
          <span class={`pot-menu-item--icon`}>🙄</span>
          <span class={`pot-menu-item--label`}>{renderLabel.value(menuInfo.value)}</span>
          <span class={`pot-menu-item--trigger`} />
        </div>
        <ul class={[`pot-menu`]} style={getContentStyles.value}>
          {children.value.map((item) => {
            return (
              <>
                {!item.children && <MenuItem menuInfo={item} {...getProps.value} />}
                {item.children && <Submenu menuInfo={item} {...getProps.value} />}
              </>
            );
          })}
        </ul>
      </li>
    );
  },
});
