import { defineComponent, unref, computed } from 'vue';
import LayoutLogo from './Logo';
import { useInjectConfig, useInjectHooks } from '../hooks';
import LayoutTrigger from './Trigger';

export default defineComponent({
  name: 'PotSidebar',
  setup(props, { slots }) {
    const { prefixCls, collapsed, isMobile, hasSidebar } = useInjectConfig();
    const { isFullHeader, toggleSidebar } = useInjectHooks();

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
      const sidebarClassName = computed(() => ({
        [`${prefixCls.value}-sidebar`]: true,
        [`${prefixCls.value}-sidebar--mix`]: isFullHeader.value,
        [`collapsed`]: collapsed.value,
      }));
      const placeholderClassName = computed(() => ({
        [`${prefixCls.value}-sidebar--placeholder`]: true,
        [`collapsed`]: collapsed.value,
      }));

      return (
        <>
          <aside class={placeholderClassName.value} />
          <aside class={sidebarClassName.value}>
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
      const sidebarClassName = computed(() => ({
        [`${prefixCls.value}-sidebar`]: true,
        [`${prefixCls.value}-sidebar--mobile`]: isMobile.value,
        [`collapsed`]: collapsed.value,
      }));
      return (
        <>
          {!unref(collapsed) && (
            <aside class={`${prefixCls.value}-sidebar--overlay`} onClick={toggleSidebar} />
          )}
          <aside class={sidebarClassName.value}>
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
