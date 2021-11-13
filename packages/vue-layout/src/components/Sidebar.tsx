import { defineComponent, unref, computed, CSSProperties } from 'vue';
import LayoutLogo from './Logo';
import { useInjectConfig, useInjectHooks } from '../hooks';
import LayoutTrigger from './Trigger';
import { TriggerPlacement } from '../types';
import { extendSlots } from '../utils';
import { Menu } from './Menu';

export default defineComponent({
  name: 'PotSidebar',
  emits: ['menu-select'],
  setup(props, { slots }) {
    const { collapsed } = useInjectConfig();
    const { prefixCls, isMobile, hasSidebar, triggerPlacement, isFullHeader, menuData } =
      useInjectConfig();
    const { toggleSidebar } = useInjectHooks();

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
        [`${prefixCls.value}-drawer--open`]: !collapsed.value,
      }));

      const getStyles = computed(
        (): CSSProperties => ({
          ...(collapsed.value && {
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
