import type { Plugin, App } from 'vue';
import { computed, defineComponent, reactive } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import { extendSlots, treeFindPath } from '../utils';
import type { LayoutSettings, MenuSelectHandler } from '../defaultSettings';
import { defaultLayoutProps, MenuMode } from '../defaultSettings';
import { useProvideSettings, useProvideShared } from '../hooks/injection';
import useWindowResizeListener from '../hooks/windowResize';

const Layout = defineComponent({
  name: 'PotLayout',
  props: defaultLayoutProps,
  setup(props: LayoutSettings, { slots, emit }) {
    const state = reactive({
      collapsed: false,
      mobile: false,
    });

    const hasSidebar = computed((): boolean => props.menuMode !== MenuMode.TOP);
    const isFullHeader = computed(
      (): boolean => props.menuMode === MenuMode.MIX || props.menuMode === MenuMode.MIX_SIDE,
    );
    const isCollapsed = computed((): boolean => state.collapsed);
    const isMobile = computed((): boolean => state.mobile);
    const getMenuActivePaths = computed(() => {
      return treeFindPath(
        props.menuData,
        (t) => t[props.menuKey] === props.menuActive,
        props.menuKey,
      );
    });
    const onMenuSelect: MenuSelectHandler = (index, menu) => {
      emit('menuSelect', index, menu);
    };
    const toggleSidebar = () => {
      state.collapsed = !state.collapsed;
    };

    {
      useProvideSettings(props);
      useProvideShared({
        hasSidebar,
        isFullHeader,
        isCollapsed,
        isMobile,
        getMenuActivePaths,
        onMenuSelect,
        toggleSidebar,
      });

      useWindowResizeListener(({ width }) => {
        // console.log('#on window resize', width);
        state.mobile = width - 1 < 992;
      });
    }

    function render(slotNames: string[]) {
      const localSlots = extendSlots(slots, slotNames, {});

      return (BasicComponent: any, requiredSelf = true) => {
        const { default: currentSlot, ...scopeSlots } = localSlots;

        if (requiredSelf) {
          return (
            <>
              {currentSlot && (
                <BasicComponent>{{ default: currentSlot, ...scopeSlots }}</BasicComponent>
              )}
            </>
          );
        } else {
          return <BasicComponent>{{ ...scopeSlots }}</BasicComponent>;
        }
      };
    }

    /**
     * render all components of layout
     */
    return () => (
      <LayoutContainer>
        {
          /* render full header */ render(['default:header', 'logo', 'action', 'trigger'])(
            LayoutFullHeader,
          )
        }
        <LayoutContainer direction={'horizontal'}>
          {
            /* render sidebar */
            // render(['default:sidebar', 'logo', 'trigger'])(LayoutSidebar)
            hasSidebar.value && render(['logo', 'trigger'])(LayoutSidebar, false)
          }
          <LayoutContainer>
            {
              /* render multiple header */ render(['default:header', 'logo', 'action', 'trigger'])(
                LayoutMultipleHeader,
              )
            }
            {/* render content */ render(['default'])(LayoutContent)}
            {/* render footer */ render(['default:footer'])(LayoutFooter)}
          </LayoutContainer>
        </LayoutContainer>
      </LayoutContainer>
    );
  },
});

Layout.install = function (app: App) {
  app.component(Layout.name, Layout);
  return app;
};

export default Layout as typeof Layout & Plugin;
