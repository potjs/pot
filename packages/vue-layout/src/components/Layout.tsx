import type { Plugin, App, ExtractPropTypes, PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import type { PotConfigProviderProps } from '../hooks';
import { useProvideConfig, useWindowResizeListener } from '../hooks';
import { MenuMode, TriggerPlacement } from '../enums';

export const layoutProps = {
  prefixCls: {
    type: String,
    default: 'pot-layout',
  },
  theme: {
    type: String as PropType<'dark' | 'light'>,
    default: 'dark',
  },
  menuMode: {
    type: String as PropType<MenuMode>,
    default: MenuMode.SIDEBAR,
  },
  headerHeight: {
    type: String,
    default: '60px',
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
  footer: {
    type: Boolean,
    default: false,
  },
  footerHeight: {
    type: String,
    default: '60px',
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
      prefixCls: computed(() => props.prefixCls),
      theme: computed(() => props.theme),
      menuMode: computed(() => props.menuMode),
      headerHeight: computed(() => props.headerHeight),
      headerMix: computed(() => props.headerMix),
      sidebarWidth: computed(() => props.sidebarWidth),
      sidebarCollapsedWidth: computed(() => props.sidebarCollapsedWidth),
      footer: computed(() => props.footer),
      footerHeight: computed(() => props.footerHeight),
      trigger: computed(() => props.trigger),
      collapsed: ref(false),
      isMobile: ref(false),
    };

    useProvideConfig(configProvider);

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
      <LayoutContainer class={`${props.prefixCls}-${props.theme}`}>
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
