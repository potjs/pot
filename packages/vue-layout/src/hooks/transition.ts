import type { TransitionProps, Ref, CSSProperties } from 'vue';
import { nextTick } from 'vue';

export const useCollapseTransition = (
  style: Ref<CSSProperties>,
  className: Ref<string>,
): TransitionProps => {
  return {
    name: 'pot-collapse-transition',
    onBeforeEnter: () => {
      className.value = 'pot-collapse-transition';
      style.value = { height: 0, opacity: 0 };
    },
    onEnter: (node) => {
      nextTick(() => {
        style.value = {
          height: `${node.scrollHeight}px`,
          opacity: 1,
        };
      });
    },
    onAfterEnter: () => {
      className.value = '';
      style.value = {};
    },
    onBeforeLeave: (node) => {
      className.value = 'pot-collapse-transition';
      style.value = { height: `${(<any>node).offsetHeight}px` };
    },
    onLeave: () => {
      window.setTimeout(() => {
        style.value = { height: 0, opacity: 0 };
      });
    },
    onAfterLeave: () => {
      className.value = '';
      style.value = {};
    },
  };
};
