import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import { useCssModules } from '../../hooks/useCss';
import LayoutLogo from './Logo';
import { useInjectConfig, useInjectHooks } from '../../hooks';
import LayoutTrigger from './Trigger';

const { sidebarCls, sidebarOverlayCls, sidebarPlaceholderCls, sidebarWrapperCls } = useCssModules();

export default defineComponent({
  name: 'PotSidebar',
  setup(props, { slots }) {
    const { collapsed, sidebarCollapsedWidth, sidebarWidth, headerHeight, isMobile } =
      useInjectConfig();
    const { isFullHeader, hasSidebar, toggleSidebar } = useInjectHooks();

    const renderLogo = () => {
      return (
        <>
          {slots.logo && (
            <LayoutLogo from={'sidebar'}>
              {{
                default: () => slots.logo?.({}),
              }}
            </LayoutLogo>
          )}
        </>
      );
    };

    const renderSidebar = () => {
      const getStyles = computed(
        (): CSSProperties => ({
          ...(unref(collapsed)
            ? {
                width: unref(sidebarCollapsedWidth),
                maxWidth: unref(sidebarCollapsedWidth),
                minWidth: unref(sidebarCollapsedWidth),
                flex: `0 0 ${unref(sidebarCollapsedWidth)}`,
              }
            : {
                width: unref(sidebarWidth),
                maxWidth: unref(sidebarWidth),
                minWidth: unref(sidebarWidth),
                flex: `0 0 ${unref(sidebarWidth)}`,
              }),
          ...(unref(isFullHeader) && {
            top: unref(headerHeight),
          }),
        }),
      );

      return (
        <>
          <aside class={sidebarPlaceholderCls} style={unref(getStyles)} />
          <aside class={{ [sidebarCls]: true }} style={unref(getStyles)}>
            {!unref(isFullHeader) && renderLogo()}
            {slots.default && <div class={sidebarWrapperCls}>{slots.default?.({})}</div>}
            {unref(hasSidebar) && <LayoutTrigger from={'sidebar'} />}
          </aside>
        </>
      );
    };

    const renderMobileSidebar = () => {
      const getStyles = computed(
        (): CSSProperties => ({
          position: 'absolute',
          ...(unref(collapsed)
            ? {
                width: 0,
              }
            : {
                width: unref(sidebarWidth),
              }),
        }),
      );
      return (
        <>
          {!unref(collapsed) && <aside class={sidebarOverlayCls} onClick={toggleSidebar} />}
          <aside class={{ [sidebarCls]: true }} style={unref(getStyles)}>
            {renderLogo()}
            {slots.default && <div class={sidebarWrapperCls}>{slots.default?.({})}</div>}
          </aside>
        </>
      );
    };

    return () => <>{unref(isMobile) ? renderMobileSidebar() : renderSidebar()}</>;
  },
});
