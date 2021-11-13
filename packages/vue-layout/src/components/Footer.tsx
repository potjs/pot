import { defineComponent } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotFooter',
  setup(props, { slots }) {
    const { prefixCls } = useInjectConfig();

    return () => (
      <>
        {slots.default && (
          <footer class={`${prefixCls.value}-footer`}>{slots.default?.({})}</footer>
        )}
      </>
    );
  },
});
