import { defineComponent, unref, computed, CSSProperties } from 'vue';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { TriggerPlacement } from '../defaultSettings';
import { extendSlots } from '../utils';
import { Menu } from './Menu';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export default defineComponent({
  name: 'PotSidebar',
  emits: ['menu-select'],
  setup(props, { slots }) {
    const { prefixCls, triggerPlacement, menuData } = useInjectSettings();
    const { isCollapsed, isMobile, hasSidebar, isFullHeader, toggleSidebar } = useInjectShared();

    const renderLogo = () => {
      return (
        <>
          {slots.logo && (
            <LayoutLogo>
              {{
                default: () => slots.logo?.({}),
              }}
            </LayoutLogo>
          )}
        </>
      );
    };

    const renderMenu = () => {
      return <>{menuData.value && <Menu options={menuData.value} />}</>;
    };

    const renderSidebar = () => {
      const sidebarClassName = computed(() => ({
        [`${prefixCls.value}-sidebar`]: true,
        [`${prefixCls.value}-sidebar--mix`]: isFullHeader.value,
        [`collapsed`]: isCollapsed.value,
      }));
      const placeholderClassName = computed(() => ({
        [`${prefixCls.value}-sidebar--placeholder`]: true,
        [`collapsed`]: isCollapsed.value,
      }));

      return (
        <>
          <aside class={placeholderClassName.value} />
          <aside class={sidebarClassName.value}>
            {!unref(isFullHeader) && renderLogo()}
            {/*{slots.default && (*/}
            {/*  <div class={`${prefixCls.value}-sidebar--wrapper`}>{slots.default?.({})}</div>*/}
            {/*)}*/}
            <div class={`${prefixCls.value}-sidebar--wrapper`}>{renderMenu()}</div>
            {unref(hasSidebar) && TriggerPlacement.BOTTOM === triggerPlacement.value && (
              <LayoutTrigger>{{ ...extendSlots(slots, ['default:trigger']) }}</LayoutTrigger>
            )}
          </aside>
        </>
      );
    };

    const renderMobileSidebar = () => {
      const className = computed(() => ({
        [`${prefixCls.value}-drawer`]: true,
        [`${prefixCls.value}-drawer--open`]: !isCollapsed.value,
      }));

      const getStyles = computed(
        (): CSSProperties => ({
          ...(isCollapsed.value && {
            width: '0',
          }),
        }),
      );
      return (
        <div class={className.value}>
          <aside class={`${prefixCls.value}-drawer--mask`} onClick={toggleSidebar} />
          <aside class={`${prefixCls.value}-sidebar`} style={getStyles.value}>
            {renderLogo()}
            {/*{slots.default && (*/}
            {/*  <div class={`${prefixCls.value}-sidebar--wrapper`}>{slots.default?.({})}</div>*/}
            {/*)}*/}
            <div class={`${prefixCls.value}-sidebar--wrapper`}>{renderMenu()}</div>
          </aside>
        </div>
      );
    };

    return () => <>{unref(isMobile) ? renderMobileSidebar() : renderSidebar()}</>;
  },
});
