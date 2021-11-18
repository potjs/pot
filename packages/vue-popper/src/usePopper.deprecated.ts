/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/index.ts
 */
import { computed, ref, reactive, watch, unref } from 'vue';
import { createPopper } from '@popperjs/core';
import { isBool, isHTMLElement, isArray, isString, generateId } from './utils';
import usePopperOptions from './popperOptions';

import type {
  ComponentPublicInstance,
  SetupContext,
  Ref,
  WritableComputedRef,
  ComputedRef,
} from 'vue';
import type { Instance as PopperInstance } from '@popperjs/core';
import type {
  TimeoutHandle,
  Nullable,
  IPopperOptions,
  RefElement,
  TriggerType,
} from './defaultSetting';
import type { IUsePopperState } from './popperOptions';

export type ElementType = ComponentPublicInstance | HTMLElement;
export type EmitType =
  | 'update:visible'
  | 'after-enter'
  | 'after-leave'
  | 'before-enter'
  | 'before-leave';

export interface PopperEvents {
  onClick?: (e: Event) => void;
  onMouseenter?: (e: Event) => void;
  onMouseleave?: (e: Event) => void;
  onFocus?: (e: Event) => void;
  onBlur?: (e: Event) => void;
}

export const DEFAULT_TRIGGER = ['hover'];
export const UPDATE_VISIBLE_EVENT = 'update:visible';

export interface IUsePopperReturns {
  update: () => void;
  doDestroy: (_: boolean) => void;
  show: () => void;
  hide: () => void;
  onPopperMouseEnter: () => void;
  onPopperMouseLeave: () => void;
  onAfterEnter: () => void;
  onAfterLeave: () => void;
  onBeforeEnter: () => void;
  onBeforeLeave: () => void;
  initializePopper: () => void;
  isManual: ComputedRef<boolean>;
  arrowRef: Ref<RefElement>;
  events: PopperEvents;
  popperInstance: Nullable<PopperInstance>;
  popperRef: Ref<RefElement>;
  triggerRef: Ref<ElementType>;
  visibility: WritableComputedRef<boolean>;
  popperId: string;
}

export function usePopper(
  props: IPopperOptions,
  { emit }: SetupContext<EmitType[]>,
): IUsePopperReturns {
  const arrowRef = ref<RefElement>(null);
  // const triggerRef = ref(null) as Ref<ElementType>;
  const triggerRef = ref<RefElement>(null) as Ref<ElementType>;
  const popperRef = ref<RefElement>(null);

  let popperInstance: Nullable<PopperInstance> = null;
  let showTimer: Nullable<TimeoutHandle> = null;
  let hideTimer: Nullable<TimeoutHandle> = null;
  let triggerFocused = false;

  const isManual = computed((): boolean => props.trigger === 'manual');

  const popperOptions = usePopperOptions(props, <IUsePopperState>{
    arrow: arrowRef,
  });

  const state = reactive({
    visible: props.visible,
  });

  // visible has been taken by props.visible, avoiding name collision
  // Either marking type here or setter parameter
  const visibility = computed<boolean>({
    get() {
      if (props.disabled) {
        return false;
      } else {
        return isBool(props.visible) ? props.visible : state.visible;
      }
    },
    set(val) {
      if (unref(isManual)) return;
      isBool(props.visible) ? emit(UPDATE_VISIBLE_EVENT, val) : (state.visible = val);
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
    if (unref(isManual) || props.disabled) return;
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
    if (unref(isManual)) return;
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
    if (!unref(visibility)) {
      return;
    }
    const unwrappedTrigger = unref(triggerRef);
    const _trigger = isHTMLElement(unwrappedTrigger)
      ? unwrappedTrigger
      : (unwrappedTrigger as ComponentPublicInstance).$el;
    popperInstance = createPopper(_trigger, <HTMLElement>unref(popperRef), unref(popperOptions));

    popperInstance.update();
  }

  function doDestroy(forceDestroy?: boolean) {
    /* istanbul ignore if */
    if (!popperInstance || (unref(visibility) && !forceDestroy)) return;
    detachPopper();
  }

  function detachPopper() {
    popperInstance?.destroy?.();
    popperInstance = null;
  }

  const events = {} as PopperEvents;

  function update() {
    if (!unref(visibility)) {
      return;
    }
    if (popperInstance) {
      popperInstance.update().then();
    } else {
      initializePopper();
    }
  }

  function onVisibilityChange(toState: boolean) {
    if (toState) {
      initializePopper();
    }
  }

  if (!unref(isManual)) {
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
          if (triggerFocused) {
            // reset previous focus event
            triggerFocused = false;
          } else {
            toggleState();
          }
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
        case 'focus': {
          triggerFocused = true;
          show();
          break;
        }
        case 'blur': {
          triggerFocused = false;
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
    if (!popperInstance) return;
    await popperInstance.setOptions(val);
    await popperInstance.update();
  });

  watch(visibility, onVisibilityChange);

  return {
    update,
    doDestroy,
    show,
    hide,
    onPopperMouseEnter,
    onPopperMouseLeave,
    onAfterEnter: () => {
      emit('after-enter');
    },
    onAfterLeave: () => {
      detachPopper();
      emit('after-leave');
    },
    onBeforeEnter: () => {
      emit('before-enter');
    },
    onBeforeLeave: () => {
      emit('before-leave');
    },
    initializePopper,
    isManual,
    arrowRef,
    events,
    popperInstance,
    popperRef,
    triggerRef,
    visibility,
    popperId: generateId(),
  };
}
