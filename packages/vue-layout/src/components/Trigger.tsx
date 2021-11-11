import { computed, defineComponent } from 'vue';
import { useInjectConfig, useInjectHooks } from '../hooks';

export default defineComponent({
  name: 'PotTrigger',
  setup(props, { slots }) {
    const { prefixCls, collapsed } = useInjectConfig();
    const { toggleSidebar } = useInjectHooks();

    const hamburgerClass = computed(() => ({
      [`${prefixCls.value}-hamburger`]: true,
      [`active`]: collapsed.value,
    }));

    const renderIcon = () => {
      if (slots.default) {
        return <>{slots.default?.({})}</>;
      } else {
        return (
          <>
            <div class={hamburgerClass.value}>
              <span class={`${prefixCls.value}-hamburger--top`} />
              <span class={`${prefixCls.value}-hamburger--mid`} />
              <span class={`${prefixCls.value}-hamburger--bottom`} />
            </div>
          </>
        );
      }
    };

    return () => (
      <>
        <div class={`${prefixCls.value}-trigger`} onClick={toggleSidebar}>
          {renderIcon()}
        </div>
      </>
    );
  },
});
