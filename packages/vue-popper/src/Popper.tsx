import {
  defineComponent,
  // createVNode,
  Teleport,
  // Fragment,
  // onMounted,
  // withDirectives,
  // vShow,
  // computed,
  // reactive,
  ref,
} from 'vue';
import type { IPopperOptions } from './defaultSetting';
import { defaultPopperProps } from './defaultSetting';
// import { renderTrigger } from './renderers';
import usePopper from './usePopper';

export default defineComponent({
  name: 'PotPopper',
  props: defaultPopperProps,
  emits: ['update:visible', 'after-enter', 'after-leave', 'before-enter', 'before-leave'],
  setup(props, { slots }) {
    const triggerRef = ref(null);
    const popperRef = ref(null);

    const { styles, attributes, events, visibility, onPopperMouseEnter, onPopperMouseLeave } =
      usePopper(triggerRef, popperRef, props as IPopperOptions);

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
          <div
            ref={popperRef}
            style={styles.popper}
            class={props.class}
            {...attributes.popper}
            v-show={visibility.value}
            onMouseenter={onPopperMouseEnter}
            onMouseleave={onPopperMouseLeave}
          >
            {slots.content?.()}
          </div>
        </Teleport>
      </>
    );
  },
});
