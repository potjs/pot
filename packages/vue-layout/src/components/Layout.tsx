import type { Plugin, App } from 'vue';
import { computed, defineComponent, provide, reactive } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import { extendSlots, treeFindPath } from '../utils';
import type { LayoutSettings } from '../defaultSettings';
import { defaultLayoutProps, InjectSettingsKey, InjectSharedKey } from '../defaultSettings';
import { MenuMode } from '../types';
import { useWindowResizeListener } from '../hooks';

const Layout = defineComponent({
  name: 'PotLayout',
  props: defaultLayoutProps,
  setup(props: LayoutSettings, { slots }) {
    const state = reactive({
      collapsed: false,
      mobile: false,
    });

    provide(InjectSettingsKey, props);

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
    const onMenuSelect = () => {
      console.log('#onMenuSelect');
    };
    const toggleSidebar = () => {
      state.collapsed = !state.collapsed;
    };

    provide(InjectSharedKey, {
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
