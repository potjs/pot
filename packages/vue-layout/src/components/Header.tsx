import { defineComponent, unref } from 'vue';
import LayoutLogo from './Logo';
import LayoutTrigger from './Trigger';
import { useInjectConfig, useInjectHooks } from '../hooks';
import { TriggerPlacement } from '../enums';
import { extendSlots } from '../utils';

const Header = defineComponent({
  name: 'PotHeader',
  setup(props, { slots }) {
    const { prefixCls, hasSidebar, trigger } = useInjectConfig();
    const { isFullHeader } = useInjectHooks();

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

    return () => (
      <header class={`${prefixCls.value}-header`}>
        {
          <div class={`${prefixCls.value}-header--left`}>
            {unref(isFullHeader) && renderLogo()}
            {unref(hasSidebar) && TriggerPlacement.TOP === trigger.value && (
              <LayoutTrigger>{{ ...extendSlots(slots, ['default:trigger']) }}</LayoutTrigger>
            )}
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
    const { prefixCls } = useInjectConfig();
    const { isFullHeader } = useInjectHooks();
    return () => (
      <>
        <div class={`${prefixCls.value}-header--placeholder`} />
        {!unref(isFullHeader) && <Header>{{ ...slots }}</Header>}
      </>
    );
  },
});

export { FullHeader, MultipleHeader };
