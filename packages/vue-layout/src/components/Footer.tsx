import { defineComponent } from 'vue';
import { useInjectSettings } from '../hooks/injection';

export default defineComponent({
  name: 'PotFooter',
  setup(props, { slots }) {
    const { prefixCls } = useInjectSettings();

    return () => (
      <>
        {slots.default && (
          <footer class={`${prefixCls.value}-footer`}>{slots.default?.({})}</footer>
        )}
      </>
    );
  },
});
