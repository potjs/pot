import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotFooter',
  setup(props, { slots }) {
    const { prefixCls, footer, footerHeight } = useInjectConfig();

    const getStyles = computed(
      (): CSSProperties => ({
        height: unref(footerHeight),
      }),
    );

    return () => (
      <>
        {unref(footer) && (
          <footer class={`${prefixCls.value}-footer`} style={unref(getStyles)}>
            {slots.default?.({})}
          </footer>
        )}
      </>
    );
  },
});
