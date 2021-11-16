import {
  defineComponent,
  createVNode,
  Teleport,
  Fragment,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  renderSlot,
  toDisplayString,
  withDirectives,
} from 'vue';
import { usePopper, defaultPopperProps } from './use-popper';
import { renderPopper, renderTrigger } from './renderers';
import clickOutside from './clickOutside';

import type { IPopperOptions } from './use-popper';

export default defineComponent({
  name: 'PotPopper',
  props: defaultPopperProps,
  emits: ['update:visible', 'after-enter', 'after-leave', 'before-enter', 'before-leave'],
  setup(props, ctx) {
    const popperStates = usePopper(props as IPopperOptions, ctx);

    const forceDestroy = () => popperStates.doDestroy(true);
    onMounted(popperStates.initializePopper);
    onBeforeUnmount(forceDestroy);
    onActivated(popperStates.initializePopper);
    onDeactivated(forceDestroy);

    return popperStates;
  },

  render() {
    const {
      $slots,
      appendToBody,
      style,
      effect,
      transition,
      popperClass,
      pure,
      stopPopperMouseEvent,
      hide,
      onPopperMouseEnter,
      onPopperMouseLeave,
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
      popperStyle,
      visibility,
      popperId,
      isManualMode,
    } = this;

    const popper = renderPopper(
      {
        effect: effect,
        name: transition,
        popperClass: popperClass,
        popperId,
        popperStyle: popperStyle,
        pure: pure,
        stopPopperMouseEvent: stopPopperMouseEvent,
        onMouseenter: onPopperMouseEnter,
        onMouseleave: onPopperMouseLeave,
        onAfterEnter,
        onAfterLeave,
        onBeforeEnter,
        onBeforeLeave,
        visibility: visibility,
      },
      [
        renderSlot($slots, 'content', {}, () => {
          return [toDisplayString(this.content)];
        }),
      ],
    );

    const _t = $slots.default?.();
    if (!_t) {
      throw new Error('#PotPopper: Trigger must be provided');
    }
    const triggerProps = {
      'aria-describedby': popperId,
      style,
      ref: 'triggerRef',
      ...this.events,
    };

    const trigger = isManualMode()
      ? renderTrigger(_t, triggerProps)
      : withDirectives(renderTrigger(_t, triggerProps), [[clickOutside, hide]]);

    return createVNode(Fragment, null, [
      trigger,
      createVNode(
        Teleport as any,
        {
          to: 'body',
          disabled: !appendToBody,
        },
        [popper],
      ),
    ]);
  },
});
