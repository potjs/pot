import {
  defineComponent,
  createVNode,
  Teleport,
  Fragment,
  cloneVNode,
  ref,
  computed,
  // watch,
} from 'vue';
import { getFirstVNode } from '../../utils/vnode';

export const Popover = defineComponent({
  name: 'PotMenuPopover',
  // emits: ['visible'],
  setup(props, { slots }) {
    const inTrigger = ref(false);
    const inContent = ref(false);

    const visible = computed(() => inTrigger.value || inContent.value);

    // watch(visible, (val) => {
    //   emit('visible', val);
    // });

    const renderTrigger = () => {
      const triggerRoot = getFirstVNode(slots.default?.(), 1);
      if (!triggerRoot) {
        throw new Error('No trigger on popover');
      }

      return cloneVNode(triggerRoot, {
        onMouseover: () => {
          inTrigger.value = true;
        },
        onMouseleave: () => {
          inTrigger.value = false;
        },
      });
    };

    const renderContent = () => {
      const styles = computed(() => {
        return {
          ...(!visible.value && { display: 'none' }),
        };
      });

      return createVNode(
        'div',
        {
          class: [`pot-menu-popover`],
          style: styles.value,
          onMouseover: () => {
            inContent.value = true;
          },
          onMouseleave: () => {
            inContent.value = false;
          },
        },
        [slots.content?.()],
      );
    };

    return () =>
      createVNode(Fragment, null, [
        renderTrigger(),
        createVNode(
          Teleport as any,
          {
            to: 'body',
          },
          [renderContent()],
        ),
      ]);
  },
});
