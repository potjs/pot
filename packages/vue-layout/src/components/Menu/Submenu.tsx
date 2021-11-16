import type { CSSProperties, PropType } from 'vue';
import { computed, defineComponent, ref, toRefs } from 'vue';
import { MenuRaw } from '../../types';

import { MenuItem } from './MenuItem';
import { useInjectConfig } from '../../hooks';
// import Popper from '@potjs/vue-popper';

export const Submenu = defineComponent({
  name: 'PotSubmenu',
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
    const { collapsed, menuIndent, menuKey, menuActivePaths, renderMenuLabel } = useInjectConfig();
    const { menuInfo, depth } = toRefs(props);

    const children = computed(() => menuInfo.value.children || []);
    const index = menuInfo.value[menuKey.value];
    const getActive = computed(() => menuActivePaths.value.includes(index));
    // show or hide submenu list
    const show = ref(getActive.value);
    const toggle = () => {
      show.value = !show.value;
    };

    const getProps = computed(() => {
      return {
        depth: depth.value + 1,
      };
    });

    const className = computed(() => ({
      [`pot-menu-submenu`]: true,
      [`active`]: getActive.value,
    }));

    const getStyles = computed((): CSSProperties => {
      return {
        paddingLeft: menuIndent.value * props.depth + 'px',
      };
    });

    const renderInner = () => {
      return (
        <div
          class={[`pot-menu-submenu-item`, { [`active`]: getActive.value }]}
          style={getStyles.value}
          onClick={toggle}
        >
          <span class={`pot-menu-item--icon`}>🙄</span>
          <span class={`pot-menu-item--label`}>{renderMenuLabel.value(menuInfo.value)}</span>
          <span class={`pot-menu-item--trigger`} />
        </div>
      );
    };

    const renderContent = () => {
      const getContentStyles = computed((): CSSProperties => {
        const getShow = !show.value || collapsed.value;
        return {
          ...(getShow && {
            display: 'none',
          }),
        };
      });
      return (
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
      );
    };

    return () => (
      <li class={className.value} data-submenu-index={index}>
        {renderInner()}
        {renderContent()}
        {/*{collapsed.value && (*/}
        {/*  <Popper trigger={'click'} placement={'right-start'} appendToBody={depth.value === 0}>*/}
        {/*    {{*/}
        {/*      default: () => renderInner(),*/}
        {/*      content: () => renderContent(),*/}
        {/*    }}*/}
        {/*  </Popover>*/}
        {/*)}*/}
        {/*{!collapsed.value && (*/}
        {/*  <>*/}
        {/*    {renderInner()}*/}
        {/*    {renderContent()}*/}
        {/*  </>*/}
        {/*)}*/}
      </li>
    );
  },
});
