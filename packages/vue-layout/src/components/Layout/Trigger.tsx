import type { PropType } from 'vue';
import { computed, defineComponent, unref } from 'vue';
import { useCssModules } from '../../hooks/useCss';
import { TriggerPlacement } from '../../enums';
import { useInjectConfig, useInjectHooks } from '../../hooks';

const {
  headerTriggerCls,
  sidebarTriggerCls,
  collapsedCls,
  headerTriggerInnerCls,
  sidebarTriggerInnerCls,
} = useCssModules();

export default defineComponent({
  name: 'PotTrigger',
  props: {
    from: {
      type: String as PropType<'header' | 'sidebar'>,
      required: true,
    },
  },
  setup(props) {
    const { trigger, collapsed } = useInjectConfig();
    const { toggleSidebar } = useInjectHooks();

    const renderHeaderTrigger = () => {
      return (
        <div
          class={{ [headerTriggerCls]: true, [collapsedCls]: unref(collapsed) }}
          onClick={toggleSidebar}
        >
          {/* TODO: fix icon on trigger */}
          <span class={headerTriggerInnerCls}>Trigger</span>
        </div>
      );
    };

    const renderSidebarTrigger = () => {
      return (
        <div
          class={{ [sidebarTriggerCls]: true, [collapsedCls]: unref(collapsed) }}
          onClick={toggleSidebar}
        >
          {/* TODO: fix icon on trigger */}
          <span class={sidebarTriggerInnerCls}>Trigger</span>
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
