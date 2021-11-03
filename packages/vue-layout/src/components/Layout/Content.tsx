import { defineComponent } from 'vue';
import { useCssModules } from '../../hooks/useCss';

const { contentCls } = useCssModules();

export default defineComponent({
  name: 'AjsContent',
  setup(props, { slots }) {
    const data = {
      test: 'Hello world',
    };

    return () => (
      <main class={contentCls}>
        <>{slots.default?.(data) /* 默认插槽 */}</>
      </main>
    );
  },
});
