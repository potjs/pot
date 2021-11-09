import { defineComponent, computed } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotContainer',
  props: {
    vertical: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const { prefixCls } = useInjectConfig();

    const className = computed(() => ({
      [`${prefixCls.value}`]: true,
      [`is-row`]: !props.vertical,
    }));

    return () => (
      <section class={className.value}>
        <>{slots.default?.({})}</>
      </section>
    );
  },
});
