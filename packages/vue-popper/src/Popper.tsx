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
import { defaultPopperProps } from './defaultSetting';
import { usePopper } from './usePopper';
import { renderPopper, renderTrigger } from './renderers';
import clickOutside from './clickOutside';

import type { IPopperOptions } from './defaultSetting';

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
      class: kls,
      effect,
      transition,
      pure,
      stopPopperMouseEvent,
      hide,
      onPopperMouseEnter,
      onPopperMouseLeave,
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
      visibility,
      popperId,
      isManual,
    } = this;

    const popper = renderPopper(
      {
        effect,
        name: transition,
        popperClass: kls,
        popperId,
        pure,
        stopPopperMouseEvent,
        onMouseenter: onPopperMouseEnter,
        onMouseleave: onPopperMouseLeave,
        onAfterEnter,
        onAfterLeave,
        onBeforeEnter,
        onBeforeLeave,
        visibility,
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

    const trigger = isManual
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
