import type { PropType } from 'vue';
import { defineComponent, computed } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotContainer',
  props: {
    direction: {
      type: String as PropType<'vertical' | 'horizontal'>,
      default: 'vertical',
    },
  },
  setup(props, { slots }) {
    const { prefixCls } = useInjectConfig();

    const className = computed(() => ({
      [`${prefixCls.value}`]: true,
      [`${prefixCls.value}-${props.direction}`]: true,
    }));

    return () => (
      <section class={className.value}>
        <>{slots.default?.({})}</>
      </section>
    );
  },
});
