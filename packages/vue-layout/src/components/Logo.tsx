import { defineComponent } from 'vue';
import { useInjectSettings } from '../hooks/injection';

export default defineComponent({
  name: 'PotLogo',
  setup(props, { slots }) {
    const { prefixCls } = useInjectSettings();

    const renderLogo = () => {
      return <div class={`${prefixCls.value}-logo`}>{slots.default?.({})}</div>;
    };
    return () => <>{renderLogo()}</>;
  },
});
