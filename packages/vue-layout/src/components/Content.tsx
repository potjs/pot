import { defineComponent } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotContent',
  setup(props, { slots }) {
    const { prefixCls } = useInjectConfig();

    return () => (
      <main class={`${prefixCls.value}-content`}>
        <>{slots.default?.({}) /* 默认插槽 */}</>
      </main>
    );
  },
});
