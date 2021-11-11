import { defineComponent } from 'vue';
import { useInjectConfig } from '../hooks';

export default defineComponent({
  name: 'PotLogo',
  setup(props, { slots }) {
    const { prefixCls } = useInjectConfig();

    const renderLogo = () => {
      return <div class={`${prefixCls.value}-logo`}>{slots.default?.({})}</div>;
    };
    return () => <>{renderLogo()}</>;
  },
});
