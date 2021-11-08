import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import { useCssModules } from '../hooks/useCss';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { useInjectConfig, useInjectHooks } from '../hooks';

const {
  headerCls,
  headerLeftCls,
  headerWrapperCls,
  headerActionCls,
  isMixCls,
  headerPlaceholderCls,
} = useCssModules();

const Header = defineComponent({
  name: 'PotHeader',
  setup(props, { slots }) {
    const { collapsed, sidebarCollapsedWidth, sidebarWidth, headerHeight, isMobile } =
      useInjectConfig();
    const { isFullHeader, hasSidebar } = useInjectHooks();

    const getIsMix = computed(
      (): boolean => !unref(isMobile) && unref(hasSidebar) && !unref(isFullHeader),
    );

    const getStyles = computed((): CSSProperties => {
      return {
        height: unref(headerHeight),
        ...(unref(getIsMix) && {
          width: `calc(100% - ${
            unref(collapsed) ? unref(sidebarCollapsedWidth) : unref(sidebarWidth)
          })`,
        }),
      };
    });

    const renderLogo = () => {
      return (
        <>
          {slots.logo && (
            <LayoutLogo from={'header'}>
              {{
                default: () => slots.logo?.({}),
              }}
            </LayoutLogo>
          )}
        </>
      );
    };

    return () => (
      <header class={{ [headerCls]: true, [isMixCls]: unref(getIsMix) }} style={unref(getStyles)}>
        {
          <div class={headerLeftCls}>
            {unref(isFullHeader) && renderLogo()}
            {unref(hasSidebar) && <LayoutTrigger from={'header'} />}
          </div>
        }
        {slots.default && <div class={headerWrapperCls}>{slots.default?.({})}</div>}
        {slots.action && <div class={headerActionCls}>{slots.action?.({})}</div>}
      </header>
    );
  },
});

const FullHeader = defineComponent({
  name: 'PotFullHeader',
  setup(props, { slots }) {
    const { isFullHeader } = useInjectHooks();
    return () => <>{unref(isFullHeader) && <Header>{{ ...slots }}</Header>}</>;
  },
});

const MultipleHeader = defineComponent({
  name: 'PotMultipleHeader',
  setup(props, { slots }) {
    const { headerHeight } = useInjectConfig();
    const { isFullHeader } = useInjectHooks();
    const getStyles = computed(
      (): CSSProperties => ({
        height: unref(headerHeight),
      }),
    );
    return () => (
      <>
        <div class={headerPlaceholderCls} style={unref(getStyles)} />
        {!unref(isFullHeader) && <Header>{{ ...slots }}</Header>}
      </>
    );
  },
});

export { FullHeader, MultipleHeader };
