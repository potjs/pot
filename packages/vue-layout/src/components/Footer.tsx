import { defineComponent } from 'vue';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export default defineComponent({
  name: 'PotFooter',
  setup() {
    const { prefixCls } = useInjectSettings();
    const { getSlots } = useInjectShared();

    const slots = getSlots(['default:footer']);

    return () => (
      <>
        {slots.default && (
          <footer class={`${prefixCls.value}-footer`}>{slots.default?.({})}</footer>
        )}
      </>
    );
  },
});
