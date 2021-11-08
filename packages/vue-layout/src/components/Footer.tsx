import type { CSSProperties } from 'vue';
import { defineComponent, unref, computed } from 'vue';
import { useCssModules } from '../hooks/useCss';
import { useInjectConfig } from '../hooks';

const { footerCls } = useCssModules();

export default defineComponent({
  name: 'PotFooter',
  setup(props, { slots }) {
    const { footer, footerHeight } = useInjectConfig();

    const getStyles = computed(
      (): CSSProperties => ({
        height: unref(footerHeight),
      }),
    );

    return () => (
      <>
        {unref(footer) && (
          <footer class={footerCls} style={unref(getStyles)}>
            {slots.default?.({})}
          </footer>
        )}
      </>
    );
  },
});
