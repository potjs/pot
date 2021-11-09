import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import LayoutLogo from './Logo';
import { useInjectConfig, useInjectHooks } from '../hooks';
import LayoutTrigger from './Trigger';

export default defineComponent({
  name: 'PotSidebar',
  setup(props, { slots }) {
    const { prefixCls, collapsed, sidebarWidth, isMobile } = useInjectConfig();
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
      const className = computed(() => ({
        [`full`]: isFullHeader.value,
        [`collapsed`]: collapsed.value,
      }));

      return (
        <>
          <aside class={[`${prefixCls.value}-sidebar--placeholder`, className.value]} />
          <aside class={[`${prefixCls.value}-sidebar`, className.value]}>
            {!unref(isFullHeader) && renderLogo()}
            {slots.default && (
              <div class={`${prefixCls.value}-sidebar--wrapper`}>{slots.default?.({})}</div>
            )}
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
          {!unref(collapsed) && (
            <aside class={`${prefixCls.value}-sidebar--overlay`} onClick={toggleSidebar} />
          )}
          <aside class={`${prefixCls.value}-sidebar`} style={unref(getStyles)}>
            {renderLogo()}
            {slots.default && (
              <div class={`${prefixCls.value}-sidebar--wrapper`}>{slots.default?.({})}</div>
            )}
          </aside>
        </>
      );
    };

    return () => <>{unref(isMobile) ? renderMobileSidebar() : renderSidebar()}</>;
  },
});
