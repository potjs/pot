/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/index.ts
 */
import { computed, ref, reactive, watch, unref, WritableComputedRef } from 'vue';
import { createPopper } from '@popperjs/core';
import { isBool, isHTMLElement, isArray, isString, generateId } from '../utils';

import type { ComponentPublicInstance, CSSProperties, SetupContext, Ref } from 'vue';
import type {
  StrictModifiers,
  Placement,
  Options,
  Instance as PopperInstance,
} from '@popperjs/core';
import type { TimeoutHandle, Nullable } from '../interfaces';
import type { IPopperOptions, RefElement, TriggerType } from './defaults';

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

interface ModifierProps {
  offset?: number;
  arrow?: HTMLElement;
  arrowOffset?: number;
  gpuAcceleration?: boolean;
  fallbackPlacements?: Array<Placement>;
}

interface IUsePopperProps {
  popperOptions: Partial<Options>;
  arrowOffset: number;
  offset: number;
  placement: Placement;
  gpuAcceleration: boolean;
  fallbackPlacements: Array<Placement>;
}

interface IUsePopperState {
  arrow: Ref<HTMLElement>;
}

export const DEFAULT_TRIGGER = ['hover'];
export const UPDATE_VISIBLE_EVENT = 'update:visible';

export function buildModifiers(props: ModifierProps, externalModifiers: StrictModifiers[] = []) {
  const { arrow, arrowOffset, offset, gpuAcceleration, fallbackPlacements } = props;

  const modifiers: Array<StrictModifiers> = [
    {
      name: 'offset',
      options: {
        offset: [0, offset ?? 12],
      },
    },
    {
      name: 'preventOverflow',
      options: {
        padding: {
          top: 2,
          bottom: 2,
          left: 5,
          right: 5,
        },
      },
    },
    {
      name: 'flip',
      options: {
        padding: 5,
        fallbackPlacements: fallbackPlacements ?? [],
      },
    },
    {
      name: 'computeStyles',
      options: {
        gpuAcceleration,
        adaptive: gpuAcceleration,
      },
    },
    // tippyModifier,
  ];

  if (arrow) {
    modifiers.push({
      name: 'arrow',
      options: {
        element: arrow,
        // the arrow size is an equailateral triangle with 10px side length, the 3rd side length ~ 14.1px
        // adding a offset to the ceil of 4.1 should be 5 this resolves the problem of arrow overflowing out of popper.
        padding: arrowOffset ?? 5,
      },
    });
  }

  modifiers.push(...externalModifiers);
  return modifiers;
}

export function usePopperOptions(props: IUsePopperProps, state: IUsePopperState) {
  return computed(() => {
    return {
      placement: props.placement,
      ...props.popperOptions,
      // Avoiding overriding modifiers.
      modifiers: buildModifiers(
        {
          arrow: state.arrow.value,
          arrowOffset: props.arrowOffset,
          offset: props.offset,
          gpuAcceleration: props.gpuAcceleration,
          fallbackPlacements: props.fallbackPlacements,
        },
        props.popperOptions?.modifiers,
      ),
    };
  });
}

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
  isManualMode: () => boolean;
  arrowRef: Ref<RefElement>;
  events: PopperEvents;
  popperInstance: Nullable<PopperInstance>;
  popperRef: Ref<RefElement>;
  popperStyle: Ref<CSSProperties>;
  triggerRef: Ref<ElementType>;
  visibility: WritableComputedRef<boolean>;
  popperId: string;
}

export default function (
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

  const isManualMode = () => props.manualMode || props.trigger === 'manual';

  const popperStyle = ref<CSSProperties>({
    // zIndex: PopupManager.nextZIndex(),
  });

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
      if (isManualMode()) return;
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
    if (isManualMode() || props.disabled) return;
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
    if (isManualMode()) return;
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
      popperInstance.update();
    } else {
      initializePopper();
    }
  }

  function onVisibilityChange(toState: boolean) {
    if (toState) {
      // popperStyle.value.zIndex = PopupManager.nextZIndex();
      initializePopper();
    }
  }

  if (!isManualMode()) {
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

  watch(popperOptions, (val) => {
    if (!popperInstance) return;
    popperInstance.setOptions(val);
    popperInstance.update();
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
    isManualMode,
    arrowRef,
    events,
    popperInstance,
    popperRef,
    popperStyle,
    triggerRef,
    visibility,
    popperId: generateId(),
  };
}

export * from './defaults';
