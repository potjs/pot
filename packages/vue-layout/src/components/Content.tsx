import { defineComponent } from 'vue';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export default defineComponent({
  name: 'PotContent',
  setup() {
    const { prefixCls } = useInjectSettings();
    const { getSlots } = useInjectShared();

    const slots = getSlots(['default']);

    return () => (
      <main class={`${prefixCls.value}-content`}>
        <>{slots.default?.({}) /* 默认插槽 */}</>
      </main>
    );
  },
});
