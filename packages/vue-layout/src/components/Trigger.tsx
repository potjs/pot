import type { PropType } from 'vue';
import { computed, defineComponent, unref } from 'vue';
import { TriggerPlacement } from '../enums';
import { useInjectConfig, useInjectHooks } from '../hooks';

export default defineComponent({
  name: 'PotTrigger',
  props: {
    from: {
      type: String as PropType<'header' | 'sidebar'>,
      required: true,
    },
  },
  setup(props) {
    const { prefixCls, trigger, collapsed } = useInjectConfig();
    const { toggleSidebar } = useInjectHooks();

    const renderHeaderTrigger = () => {
      const className = computed(() => ({
        [`${prefixCls.value}-header--trigger`]: true,
        [`collapsed`]: collapsed.value,
      }));
      return (
        <div class={className.value} onClick={toggleSidebar}>
          {/* TODO: fix icon on trigger */}
          <span class={`${prefixCls.value}-header--trigger-inner`}>Trigger</span>
        </div>
      );
    };

    const renderSidebarTrigger = () => {
      const className = computed(() => ({
        [`${prefixCls.value}-sidebar--trigger`]: true,
        [`collapsed`]: collapsed.value,
      }));
      return (
        <div class={className.value} onClick={toggleSidebar}>
          {/* TODO: fix icon on trigger */}
          <span class={`${prefixCls.value}-sidebar--trigger-inner`}>Trigger</span>
        </div>
      );
    };

    const inHeader = computed(
      () => props.from === 'header' && unref(trigger) === TriggerPlacement.TOP,
    );
    const inSidebar = computed(
      () => props.from === 'sidebar' && unref(trigger) === TriggerPlacement.BOTTOM,
    );

    return () => (
      <>
        {unref(inHeader) && renderHeaderTrigger()}
        {unref(inSidebar) && renderSidebarTrigger()}
      </>
    );
  },
});
