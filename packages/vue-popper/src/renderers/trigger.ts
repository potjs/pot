import { cloneVNode } from 'vue';
import { getFirstVNode } from '../utils';

import type { VNode, Ref, ComponentPublicInstance } from 'vue';
import { Nullable } from '../defaultSetting';

type EventHandler = (e: Event) => any;
interface IRenderTriggerProps extends Record<string, unknown> {
  ref: string | Ref<Nullable<ComponentPublicInstance | HTMLElement>>;
  onClick?: EventHandler;
  onMouseover?: EventHandler;
  onMouseleave?: EventHandler;
  onFocus?: EventHandler;
}

export default function renderTrigger(trigger: VNode[], extraProps: IRenderTriggerProps) {
  const firstElement = getFirstVNode(trigger, 1);
  if (!firstElement) {
    throw new Error('#renderTrigger: trigger expects single rooted node');
  }
  return cloneVNode(firstElement, extraProps, true);
}
