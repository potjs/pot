import { defineComponent } from 'vue';
import { useInjectSettings } from '../hooks/injection';

export default defineComponent({
  name: 'PotContent',
  setup(props, { slots }) {
    const { prefixCls } = useInjectSettings();

    return () => (
      <main class={`${prefixCls.value}-content`}>
        <>{slots.default?.({}) /* 默认插槽 */}</>
      </main>
    );
  },
});
