import {
  defineComponent,
  // createVNode,
  Teleport,
  Transition,
  ref,
} from 'vue';
import type { PopperOptions } from './defaultSetting';
import { defaultPopperProps } from './defaultSetting';
import usePopper from './usePopper';
import { renderTrigger, renderArrow } from './renderers';

export default defineComponent({
  name: 'PotPopper',
  props: defaultPopperProps,
  emits: ['update:visible', 'after-enter', 'after-leave', 'before-enter', 'before-leave'],
  setup(props, { slots, emit }) {
    const triggerRef = ref(null);
    const popperRef = ref(null);

    const { popperId, events, visibility, onPopperMouseEnter, onPopperMouseLeave } = usePopper(
      triggerRef,
      popperRef,
      props as PopperOptions,
    );

    const transitionEvents = {
      onAfterEnter: () => {
        emit('after-enter');
      },
      onAfterLeave: () => {
        emit('after-leave');
      },
      onBeforeEnter: () => {
        emit('before-enter');
      },
      onBeforeLeave: () => {
        emit('before-leave');
      },
    };

    return () => (
      <>
        {slots.default &&
          renderTrigger(slots.default(), {
            'aria-describedby': popperId,
            ref: triggerRef,
            ...events,
          })}

        <Teleport to={'body'} disabled={!props.appendToBody}>
          <Transition name={props.transition} {...transitionEvents}>
            <div
              ref={popperRef}
              aria-hidden={!visibility.value}
              role={'tooltip'}
              id={popperId}
              class={props.class}
              v-show={visibility.value}
              onMouseenter={onPopperMouseEnter}
              onMouseleave={onPopperMouseLeave}
            >
              {slots.content?.()}
              {renderArrow(props.showArrow)}
            </div>
          </Transition>
        </Teleport>
      </>
    );
  },
});
