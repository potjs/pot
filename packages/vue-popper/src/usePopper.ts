/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/index.ts
 */
import type { Ref, WritableComputedRef, ComponentPublicInstance } from 'vue';
import type { Instance as PopperInstance, StrictModifiers } from '@popperjs/core';
import type {
  PopperOptions,
  Nullable,
  TimeoutHandle,
  TriggerType,
  RefElement,
} from './defaultSetting';

import {
  computed,
  onMounted,
  onBeforeUnmount,
  onActivated,
  onDeactivated,
  reactive,
  ref,
  watch,
} from 'vue';
import { createPopper } from '@popperjs/core';
import { generateId, isArray, isHTMLElement, isString } from './utils';
import usePopperOptions, { UsePopperState } from './popperOptions';

export interface PopperEvents {
  onClick?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export interface UsePopperResult {
  popperId: string;
  events: PopperEvents;
  visibility: WritableComputedRef<boolean>;
  onPopperMouseEnter: () => void;
  onPopperMouseLeave: () => void;
}

export default function usePopper(
  referenceElement: Ref<Nullable<HTMLElement | ComponentPublicInstance>>,
  popperElement: Ref<Nullable<HTMLElement>>,
  props: PopperOptions,
): UsePopperResult {
  const arrowRef = ref<RefElement>(null);
  const popperInstance = ref<Nullable<PopperInstance>>(null);
  const state = reactive({
    visible: props.visible,
  });
  const popperOptions = usePopperOptions(props, <UsePopperState>{
    arrow: arrowRef,
  });

  const visibility = computed<boolean>({
    get() {
      return state.visible;
    },
    set(val) {
      state.visible = val;
    },
  });

  let showTimer: Nullable<TimeoutHandle> = null;
  let hideTimer: Nullable<TimeoutHandle> = null;

  function initializePopper() {
    if (!referenceElement.value || !popperElement.value) {
      return;
    }

    const reference = isHTMLElement(referenceElement.value)
      ? referenceElement.value
      : (referenceElement.value as ComponentPublicInstance).$el;

    popperInstance.value = createPopper(reference, popperElement.value, popperOptions.value);
  }

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
    if (props.disabled) {
      return;
    }
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
    if (!popperInstance.value || (visibility.value && !forceDestroy)) {
      return;
    }
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

    if (shouldPrevent) {
      return;
    }

    hide();
  }

  function onVisibilityChange(visible: boolean) {
    // Disable the event listeners
    popperInstance.value?.setOptions((options) => ({
      ...options,
      modifiers: [
        ...(options.modifiers as StrictModifiers[]),
        { name: 'eventListeners', enabled: visible },
      ],
    }));

    if (visible) {
      // Update its position
      popperInstance.value?.update();
    }
  }

  const events = {} as PopperEvents;
  {
    // add trigger events
    const toggleState = () => {
      if (visibility.value) {
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

  const forceDestroy = () => doDestroy(true);
  onMounted(initializePopper);
  onBeforeUnmount(forceDestroy);
  onActivated(initializePopper);
  onDeactivated(forceDestroy);

  watch(visibility, onVisibilityChange);

  return {
    popperId: generateId(),
    visibility,
    events,
    onPopperMouseEnter,
    onPopperMouseLeave,
  };
}
