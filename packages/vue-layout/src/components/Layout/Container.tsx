import { defineComponent, computed, unref } from 'vue';
import { useCssModules } from '../../hooks/useCss';

const { layoutCls, isRowCls } = useCssModules();

export default defineComponent({
  name: 'PotContainer',
  props: {
    vertical: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    const getClasses = computed(() => ({
      [layoutCls]: true,
      [isRowCls]: !props.vertical,
    }));

    return () => (
      <section class={unref(getClasses)}>
        <>{slots.default?.({})}</>
      </section>
    );
  },
});
