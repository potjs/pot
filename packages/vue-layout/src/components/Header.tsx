import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { useInjectConfig, useInjectHooks } from '../hooks';

const Header = defineComponent({
  name: 'PotHeader',
  setup(props, { slots }) {
    const { prefixCls, collapsed, sidebarCollapsedWidth, sidebarWidth, headerHeight, isMobile } =
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

    const className = computed(() => ({
      [`${prefixCls.value}-header`]: true,
      [`is-mix`]: getIsMix.value,
    }));

    return () => (
      <header class={className.value} style={unref(getStyles)}>
        {
          <div class={`${prefixCls.value}-header--left`}>
            {unref(isFullHeader) && renderLogo()}
            {unref(hasSidebar) && <LayoutTrigger from={'header'} />}
          </div>
        }
        {slots.default && (
          <div class={`${prefixCls.value}-header--wrapper`}>{slots.default?.({})}</div>
        )}
        {slots.action && (
          <div class={`${prefixCls.value}-header--action`}>{slots.action?.({})}</div>
        )}
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
    const { prefixCls, headerHeight } = useInjectConfig();
    const { isFullHeader } = useInjectHooks();
    const getStyles = computed(
      (): CSSProperties => ({
        height: unref(headerHeight),
      }),
    );
    return () => (
      <>
        <div class={`${prefixCls.value}-header--placeholder`} style={unref(getStyles)} />
        {!unref(isFullHeader) && <Header>{{ ...slots }}</Header>}
      </>
    );
  },
});

export { FullHeader, MultipleHeader };
