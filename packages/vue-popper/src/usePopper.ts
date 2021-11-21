import type { Instance as PopperInstance } from '@popperjs/core';
import type { WritableComputedRef, Ref } from 'vue';
import type { Nullable, IPopperOptions, RefElement } from './defaultSetting';

import {
  computed,
  onActivated,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  reactive,
  ref,
  unref,
  watch,
} from 'vue';
import { createPopper } from '@popperjs/core';
import usePopperOptions from './popperOptions';
import { TimeoutHandle, TriggerType } from './defaultSetting';
import { isArray, isString } from './utils';

// type Attributes = {
//   [key: string]: { [key: string]: string };
// };
//
// type Styles = {
//   [key: string]: CSSProperties;
// };

type State = {
  // styles: Styles;
  // attributes: Attributes;
  visible: boolean;
};

export interface PopperEvents {
  onClick?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface UsePopperResult {
  update: () => void;
  forceUpdate: () => void;
  events: PopperEvents;
  visibility: WritableComputedRef<boolean>;
  onPopperMouseEnter: () => void;
  onPopperMouseLeave: () => void;
}

interface IUsePopperState {
  arrow: Ref<HTMLElement>;
}

export default function usePopper(
  referenceElement: Ref<Nullable<HTMLElement>>,
  popperElement: Ref<Nullable<HTMLElement>>,
  props: IPopperOptions,
): UsePopperResult {
  const popperInstance = ref<Nullable<PopperInstance>>(null);
  const state = reactive(<State>{
    visible: props.visible,
  });
  const arrowRef = ref<RefElement>(null);
  const popperOptions = usePopperOptions(props, <IUsePopperState>{
    arrow: arrowRef,
  });
  let showTimer: Nullable<TimeoutHandle> = null;
  let hideTimer: Nullable<TimeoutHandle> = null;

  const visibility = computed<boolean>({
    get() {
      return state.visible;
    },
    set(val) {
      state.visible = val;
    },
  });

  function _show() {
    if (props.autoClose > 0) {
      hideTimer = setTimeout(() => {
        _hide();
      }, props.autoClose);
    }
    visibility.value = true;
  }

  function _hide() {
    visibility.value = false;
  }

  function clearTimers() {
    showTimer && clearTimeout(showTimer);
    hideTimer && clearTimeout(hideTimer);
  }

  const show = () => {
    if (props.disabled) return;
    clearTimers();
    if (props.showAfter === 0) {
      _show();
    } else {
      showTimer = setTimeout(() => {
        _show();
      }, props.showAfter);
    }
  };

  const hide = () => {
    clearTimers();
    if (props.hideAfter > 0) {
      hideTimer = setTimeout(() => {
        close();
      }, props.hideAfter);
    } else {
      close();
    }
  };

  const close = () => {
    _hide();
    if (props.disabled) {
      doDestroy(true);
    }
  };

  function doDestroy(forceDestroy?: boolean) {
    /* istanbul ignore if */
    if (!popperInstance.value || (unref(visibility) && !forceDestroy)) return;
    detachPopper();
  }

  function detachPopper() {
    popperInstance.value?.destroy?.();
    popperInstance.value = null;
  }

  function onPopperMouseEnter() {
    // if trigger is click, user won't be able to close popper when
    // user tries to move the mouse over popper contents
    if (props.enterable && props.trigger !== 'click') {
      hideTimer && clearTimeout(hideTimer);
    }
  }

  function onPopperMouseLeave() {
    const { trigger } = props;
    const shouldPrevent =
      (isString(trigger) && (trigger === 'click' || trigger === 'focus')) ||
      // we'd like to test array type trigger here, but the only case we need to cover is trigger === 'click' or
      // trigger === 'focus', because that when trigger is string
      // trigger.length === 1 and trigger[0] === 5 chars string is mutually exclusive.
      // so there will be no need to test if trigger is array type.
      (trigger.length === 1 && (trigger[0] === 'click' || trigger[0] === 'focus'));

    if (shouldPrevent) return;

    hide();
  }

  function initializePopper() {
    if (!state.visible) {
      return;
    }
    if (!referenceElement.value || !popperElement.value) {
      return;
    }

    popperInstance.value = createPopper(
      referenceElement.value,
      popperElement.value,
      popperOptions.value,
    );

    popperInstance.value.forceUpdate();
  }

  const forceDestroy = () => doDestroy(true);
  onMounted(initializePopper);
  onBeforeUnmount(forceDestroy);
  onActivated(initializePopper);
  onDeactivated(forceDestroy);

  const events = {} as PopperEvents;
  {
    // add trigger events
    const toggleState = () => {
      if (unref(visibility)) {
        hide();
      } else {
        show();
      }
    };

    const popperEventsHandler = (e: Event) => {
      e.stopPropagation();
      switch (e.type) {
        case 'click': {
          toggleState();
          break;
        }
        case 'mouseenter': {
          show();
          break;
        }
        case 'mouseleave': {
          hide();
          break;
        }
      }
    };

    const triggerEventsMap: Partial<Record<TriggerType, (keyof PopperEvents)[]>> = {
      click: ['onClick'],
      hover: ['onMouseenter', 'onMouseleave'],
      focus: ['onFocus', 'onBlur'],
    };

    const mapEvents = (t: TriggerType) => {
      triggerEventsMap[t]?.forEach((event) => {
        events[event] = popperEventsHandler;
      });
    };

    if (isArray(props.trigger)) {
      Object.values(props.trigger).forEach(mapEvents);
    } else {
      mapEvents(props.trigger as TriggerType);
    }
  }

  watch(popperOptions, async (val) => {
    if (!popperInstance.value) return;
    await popperInstance.value.setOptions(val);
    await popperInstance.value.update();
  });

  watch(
    () => state.visible,
    (toState) => {
      if (toState) {
        initializePopper();
      }
    },
  );

  const update = () => {};
  const forceUpdate = () => {};

  return {
    update,
    forceUpdate,
    events,
    visibility,
    onPopperMouseEnter,
    onPopperMouseLeave,
  };
}
