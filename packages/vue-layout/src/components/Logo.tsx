import { defineComponent, createVNode } from 'vue';
import { useInjectSettings, useInjectShared } from '../hooks/injection';

export default defineComponent({
  name: 'PotLogo',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { prefixCls } = useInjectSettings();
    const { getSlots } = useInjectShared();

    const slots = getSlots(['logo']);

    const render = () => {
      if (!slots.logo) {
        return () => <></>;
      }

      return createVNode(
        'div',
        {
          class: [
            `${prefixCls.value}-logo`,
            { [`${prefixCls.value}-logo-collapsed`]: props.collapsed },
          ],
        },
        [slots.logo?.({})],
      );
    };

    return () => render();
  },
});
