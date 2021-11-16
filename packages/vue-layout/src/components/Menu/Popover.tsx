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
  // ExtractPropTypes,
} from 'vue';
import usePopper, {
  defaultOptions as popoverOptions,
  IPopperOptions,
  renderPopper,
  renderTrigger,
} from '../../hooks/usePopper';

// export type PotPopoverProps = Partial<ExtractPropTypes<typeof popoverOptions>>;

// export * from '../../hooks/usePopper';

export const Popover = defineComponent({
  name: 'PotMenuPopover',
  props: popoverOptions,
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
      class: kls,
      style,
      effect,
      transition,
      popperClass,
      pure,
      stopPopperMouseEvent,
      // hide,
      onPopperMouseEnter,
      onPopperMouseLeave,
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
      popperStyle,
      visibility,
      popperId,
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
        // renderSlot($slots, 'content'),
      ],
    );

    const _t = $slots.default?.();
    if (!_t) {
      throw new Error('#PotMenuPopover: Trigger must be provided');
    }
    const trigger = renderTrigger(_t, {
      'aria-describedby': popperId,
      class: kls,
      style,
      ref: 'triggerRef',
      ...this.events,
    });

    return createVNode(Fragment, null, [
      trigger,
      createVNode(
        Teleport as any,
        {
          to: 'body',
        },
        [popper],
      ),
    ]);
  },
});
