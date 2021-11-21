import {
  defineComponent,
  // createVNode,
  Teleport,
  Transition,
  ref,
} from 'vue';
import type { IPopperOptions } from './defaultSetting';
import { defaultPopperProps } from './defaultSetting';
import usePopper from './usePopper';

export default defineComponent({
  name: 'PotPopper',
  props: defaultPopperProps,
  emits: ['update:visible', 'after-enter', 'after-leave', 'before-enter', 'before-leave'],
  setup(props, { slots }) {
    const triggerRef = ref(null);
    const popperRef = ref(null);

    const { events, visibility, onPopperMouseEnter, onPopperMouseLeave } = usePopper(
      triggerRef,
      popperRef,
      props as IPopperOptions,
    );

    return () => (
      <>
        {/*{slots.default &&*/}
        {/*  renderTrigger(slots.default(), {*/}
        {/*    ref: 'triggerRef',*/}
        {/*    ...events,*/}
        {/*  })}*/}
        <span ref={triggerRef} {...events}>
          {slots.default?.()}
        </span>

        <Teleport to={'body'} disabled={!props.appendToBody}>
          <Transition name={'fade'}>
            <div
              ref={popperRef}
              class={props.class}
              v-show={visibility.value}
              onMouseenter={onPopperMouseEnter}
              onMouseleave={onPopperMouseLeave}
            >
              {slots.content?.()}
            </div>
          </Transition>
        </Teleport>
      </>
    );
  },
});
