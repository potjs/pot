import { defineComponent, unref } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotFooter',
  setup(props, { slots }) {
    const { prefixCls, footer } = useInjectConfig();

    return () => (
      <>
        {unref(footer) && (
          <footer class={`${prefixCls.value}-footer`}>{slots.default?.({})}</footer>
        )}
      </>
    );
  },
});
