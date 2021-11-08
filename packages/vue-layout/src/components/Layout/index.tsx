import type { Plugin, App, ExtractPropTypes, PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import { useConfigureTheme } from '../../hooks/useTheme';
import type { PotConfigProviderProps } from '../../hooks';
import { useProvideConfig, useWindowResizeListener } from '../../hooks';
import { MenuMode, TriggerPlacement } from '../../enums';

export const layoutProps = {
  menuMode: {
    type: String as PropType<MenuMode>,
    default: MenuMode.SIDEBAR,
  },
  headerHeight: {
    type: String,
    default: '60px',
  },
  headerBackgroundColor: {
    type: String,
    default: '#fff',
  },
  headerMix: {
    type: Boolean,
    default: false,
  },
  sidebarWidth: {
    type: String,
    default: '210px',
  },
  sidebarCollapsedWidth: {
    type: String,
    default: '48px',
  },
  sidebarBackgroundColor: {
    type: String,
    default: '#001529',
  },
  footer: {
    type: Boolean,
    default: false,
  },
  footerHeight: {
    type: String,
    default: '60px',
  },
  footerBackgroundColor: {
    type: String,
    default: 'transparent',
  },
  trigger: {
    type: String as PropType<TriggerPlacement>,
    default: TriggerPlacement.TOP,
  },
};

export type PotLayoutProps = Partial<ExtractPropTypes<typeof layoutProps>>;

const Layout = defineComponent({
  name: 'PotLayout',
  props: layoutProps,
  setup(props, { slots }) {
    const configProvider: PotConfigProviderProps = {
      menuMode: computed(() => props.menuMode),
      headerHeight: computed(() => props.headerHeight),
      headerBackgroundColor: computed(() => props.headerBackgroundColor),
      headerMix: computed(() => props.headerMix),
      sidebarWidth: computed(() => props.sidebarWidth),
      sidebarCollapsedWidth: computed(() => props.sidebarCollapsedWidth),
      sidebarBackgroundColor: computed(() => props.sidebarBackgroundColor),
      footer: computed(() => props.footer),
      footerHeight: computed(() => props.footerHeight),
      footerBackgroundColor: computed(() => props.footerBackgroundColor),
      trigger: computed(() => props.trigger),
      collapsed: ref(false),
      isMobile: ref(false),
    };

    useProvideConfig(configProvider);
    useConfigureTheme(props);
    useWindowResizeListener(({ width }) => {
      // console.log('#on window resize', width);
      configProvider.isMobile.value = width - 1 < 992;
    });

    function render(slotNames: string[]) {
      // get exist slots
      const localSlots = slotNames.reduce((obj: Record<string, any>, name: string) => {
        // from <alias> to <key>
        const [key, alias = key] = name.split(':');
        if (slots[alias]) {
          obj[key] = () => slots[alias]?.(configProvider);
        }
        return obj;
      }, {});

      return (BasicComponent: any) => {
        const { default: currentSlot, ...scopeSlots } = localSlots;
        return (
          <>
            {currentSlot && (
              <BasicComponent>{{ default: currentSlot, ...scopeSlots }}</BasicComponent>
            )}
          </>
        );
      };
    }

    /**
     * render all components of layout
     */
    return () => (
      <LayoutContainer>
        {/* render full header */ render(['default:header', 'logo', 'action'])(LayoutFullHeader)}
        <LayoutContainer vertical={false}>
          {/* render sidebar */ render(['default:sidebar', 'logo'])(LayoutSidebar)}
          <LayoutContainer>
            {
              /* render multiple header */ render(['default:header', 'logo', 'action'])(
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
