import type { Plugin, App, ExtractPropTypes, PropType } from 'vue';
import { computed, ref, defineComponent } from 'vue';

import LayoutContainer from './Container';
import { FullHeader as LayoutFullHeader, MultipleHeader as LayoutMultipleHeader } from './Header';
import LayoutSidebar from './Sidebar';
import LayoutFooter from './Footer';
import LayoutContent from './Content';

import type { PotConfigProviderProps } from '../hooks';
import { useProvideConfig, useWindowResizeListener } from '../hooks';
import { MenuMode, MenuRaw, RenderLabelWithMenu, TriggerPlacement, Theme } from '../types';
import { extendSlots, treeFindPath } from '../utils';

const labelRenderer: RenderLabelWithMenu = (menu) => menu.label;

export const layoutProps = {
  prefixCls: {
    type: String,
    default: 'pot',
  },
  menuTheme: {
    type: String as PropType<Theme>,
    default: '',
  },
  menuMode: {
    type: String as PropType<MenuMode>,
    default: MenuMode.SIDE,
  },
  menuData: {
    type: Array as PropType<MenuRaw[]>,
    default: () => [],
  },
  menuIndent: {
    type: Number,
    default: 24,
  },
  menuKey: {
    type: String,
    default: 'key',
  },
  menuActive: {
    type: String,
    default: '',
  },
  renderMenuLabel: {
    type: Function as PropType<RenderLabelWithMenu>,
    default: labelRenderer,
  },
  triggerPlacement: {
    type: String as PropType<TriggerPlacement>,
    default: TriggerPlacement.TOP,
  },
};

export type PotLayoutProps = Partial<ExtractPropTypes<typeof layoutProps>>;

const Layout = defineComponent({
  name: 'PotLayout',
  props: layoutProps,
  emits: ['menuSelect'],
  setup(props, { slots, emit }) {
    const configProvider: PotConfigProviderProps = {
      prefixCls: computed(() => props.prefixCls + '-layout'),
      menuTheme: computed(() => props.menuTheme),
      menuMode: computed(() => props.menuMode),
      menuData: computed(() => props.menuData),
      menuIndent: computed(() => props.menuIndent),
      menuKey: computed(() => props.menuKey),
      menuActive: computed(() => props.menuActive),
      menuActivePaths: computed(() => {
        return treeFindPath(
          props.menuData,
          (t) => t[props.menuKey] === props.menuActive,
          props.menuKey,
        );
      }),
      triggerPlacement: computed(() => props.triggerPlacement),
      collapsed: ref(false),
      isMobile: ref(false),

      hasSidebar: computed((): boolean => props.menuMode !== MenuMode.TOP),
      isFullHeader: computed(
        (): boolean => props.menuMode === MenuMode.MIX || props.menuMode === MenuMode.MIX_SIDE,
      ),

      renderMenuLabel: computed(() => props.renderMenuLabel),

      onMenuSelect: (...args: any[]) => emit('menuSelect', ...args),
    };
    useProvideConfig(configProvider);

    useWindowResizeListener(({ width }) => {
      // console.log('#on window resize', width);
      configProvider.isMobile.value = width - 1 < 992;
    });

    function render(slotNames: string[]) {
      const localSlots = extendSlots(slots, slotNames, configProvider);

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
        {
          /* render full header */ render(['default:header', 'logo', 'action', 'trigger'])(
            LayoutFullHeader,
          )
        }
        <LayoutContainer direction={'horizontal'}>
          {
            /* render sidebar */
            // render(['default:sidebar', 'logo', 'trigger'])(LayoutSidebar)
            configProvider.hasSidebar.value && <LayoutSidebar />
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
