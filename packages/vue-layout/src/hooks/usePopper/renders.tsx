import {
  cloneVNode,
  ComponentPublicInstance,
  createVNode,
  CSSProperties,
  Ref,
  Transition,
  VNode,
  vShow,
  withCtx,
  withDirectives,
} from 'vue';
import { NOOP } from '../../utils';
import { getFirstVNode } from '../../utils/vnode';
import { Effect } from './defaults';

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

  const kls = [popperClass, 'pot-popper', `is-${effect}`, pure ? 'is-pure' : ''];

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
