/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/index.ts
 */
import {
  computed,
  ref,
  reactive,
  watch,
  unref,
  createVNode,
  cloneVNode,
  withDirectives,
  Transition,
  vShow,
  withCtx,
} from 'vue';
import { createPopper } from '@popperjs/core';
import { isBool, isHTMLElement, isArray, isString } from '../utils/is';
import { NOOP, generateId } from '../utils';
import { getFirstVNode } from '../utils/vnode';

import type {
  ComponentPublicInstance,
  CSSProperties,
  SetupContext,
  Ref,
  PropType,
  VNode,
} from 'vue';
import type {
  StrictModifiers,
  Placement,
  Options,
  PositioningStrategy,
  Instance as PopperInstance,
} from '@popperjs/core';
import type { TimeoutHandle, Nullable } from '../types';

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

export enum Effect {
  DARK = 'dark',
  LIGHT = 'light',
}

export type RefElement = Nullable<HTMLElement>;
export type Offset = [number, number] | number;
export type { Placement, PositioningStrategy, PopperInstance, Options };

export type TriggerType = 'click' | 'hover' | 'focus' | 'manual';

export type Trigger = TriggerType | TriggerType[];

export type IPopperOptions = {
  arrowOffset: number;
  autoClose: number;
  boundariesPadding: number;
  class: string;
  cutoff: boolean;
  disabled: boolean;
  enterable: boolean;
  hideAfter: number;
  manualMode: boolean;
  offset: number;
  placement: Placement;
  popperOptions: Partial<Options>;
  showAfter: number;
  showArrow: boolean;
  strategy: PositioningStrategy;
  trigger: Trigger;
  visible: boolean;
  stopPopperMouseEvent: boolean;
  gpuAcceleration: boolean;
  fallbackPlacements: Array<Placement>;
};

export const defaultOptions = {
  // the arrow size is an equailateral triangle with 10px side length, the 3rd side length ~ 14.1px
  // adding a offset to the ceil of 4.1 should be 5 this resolves the problem of arrow overflowing out of popper.
  arrowOffset: {
    type: Number,
    default: 5,
  },
  appendToBody: {
    type: Boolean,
    default: true,
  },
  autoClose: {
    type: Number,
    default: 0,
  },
  boundariesPadding: {
    type: Number,
    default: 0,
  },
  content: {
    type: String,
    default: '',
  },
  class: {
    type: String,
    default: '',
  },
  style: Object,
  hideAfter: {
    type: Number,
    default: 200,
  },
  cutoff: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  effect: {
    type: String as PropType<Effect>,
    default: Effect.DARK,
  },
  enterable: {
    type: Boolean,
    default: true,
  },
  manualMode: {
    type: Boolean,
    default: false,
  },
  showAfter: {
    type: Number,
    default: 0,
  },
  offset: {
    type: Number,
    default: 12,
  },
  placement: {
    type: String as PropType<Placement>,
    default: 'bottom' as Placement,
  },
  popperClass: {
    type: String,
    default: '',
  },
  pure: {
    type: Boolean,
    default: false,
  },
  // Once this option were given, the entire popper is under the users' control, top priority
  popperOptions: {
    type: Object as PropType<Partial<Options>>,
    default: () => null,
  },
  showArrow: {
    type: Boolean,
    default: false,
  },
  strategy: {
    type: String as PropType<PositioningStrategy>,
    default: 'fixed' as PositioningStrategy,
  },
  transition: {
    type: String,
    default: 'el-fade-in-linear',
  },
  trigger: {
    type: [String, Array] as PropType<Trigger>,
    default: 'hover',
  },
  visible: {
    type: Boolean,
    default: undefined,
  },
  stopPopperMouseEvent: {
    type: Boolean,
    default: true,
  },
  gpuAcceleration: {
    type: Boolean,
    default: true,
  },
  fallbackPlacements: {
    type: Array as PropType<Placement[]>,
    default: () => [],
  },
};

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

export default function (props: IPopperOptions, { emit }: SetupContext<EmitType[]>) {
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

interface IRenderPopperProps {
  effect: Effect;
  name: string;
  stopPopperMouseEvent: boolean;
  popperClass: string;
  popperStyle?: Partial<CSSProperties>;
  popperId: string;
  popperRef?: Ref<HTMLElement>;
  pure?: boolean;
  visibility: boolean;
  onMouseenter: () => void;
  onMouseleave: () => void;
  onAfterEnter?: () => void;
  onAfterLeave?: () => void;
  onBeforeEnter?: () => void;
  onBeforeLeave?: () => void;
}

export function renderPopper(props: IRenderPopperProps, children: VNode[]) {
  const {
    effect,
    name,
    stopPopperMouseEvent,
    popperClass,
    popperStyle,
    popperRef,
    pure,
    popperId,
    visibility,
    onMouseenter,
    onMouseleave,
    onAfterEnter,
    onAfterLeave,
    onBeforeEnter,
    onBeforeLeave,
  } = props;

  const kls = [popperClass, 'pot-menu-popover', `is-${effect}`, pure ? 'is-pure' : ''];

  const mouseUpAndDown = stopPopperMouseEvent ? stop : NOOP;
  return createVNode(
    Transition,
    {
      name,
      onAfterEnter,
      onAfterLeave,
      onBeforeEnter,
      onBeforeLeave,
    },
    {
      default: withCtx(() => [
        withDirectives(
          createVNode(
            'div',
            {
              'aria-hidden': String(!visibility),
              class: kls,
              style: popperStyle ?? {},
              id: popperId,
              ref: popperRef ?? 'popperRef',
              role: 'tooltip',
              onMouseenter,
              onMouseleave,
              onClick: stop,
              onMousedown: mouseUpAndDown,
              onMouseup: mouseUpAndDown,
            },
            children,
          ),
          [[vShow, visibility]],
        ),
      ]),
    },
  );
}

type EventHandler = (e: Event) => any;
interface IRenderTriggerProps extends Record<string, unknown> {
  ref: string | Ref<ComponentPublicInstance | HTMLElement>;
  onClick?: EventHandler;
  onMouseover?: EventHandler;
  onMouseleave?: EventHandler;
  onFocus?: EventHandler;
}

export function renderTrigger(trigger: VNode[], extraProps: IRenderTriggerProps) {
  const firstElement = getFirstVNode(trigger, 1);
  if (!firstElement) {
    throw new Error('#renderTrigger: trigger expects single rooted node');
  }
  return cloneVNode(firstElement, extraProps, true);
}
