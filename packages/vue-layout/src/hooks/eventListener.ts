import type { Ref } from 'vue';
import { ref, unref, watch } from 'vue';
import { debounce } from '../utils';

export interface UseEventParams {
  el?: Element | Ref<Element | undefined> | Window | any;
  name: string;
  listener: EventListener;
  options?: boolean | AddEventListenerOptions;
  delay?: number;
}

export default function useEventListener({
  el = window,
  name,
  listener,
  options,
  delay = 100,
}: UseEventParams) {
  const isDone = ref(false);
  const element = ref(el as Element) as Ref<Element>;
  const handler = debounce(listener, delay);

  const removeEventListener = (e: Element) => {
    isDone.value = true;
    e.removeEventListener(name, handler, options);
  };
  const addEventListener = (e: Element) => e.addEventListener(name, handler, options);

  watch(
    element,
    (val, old, cleanup) => {
      if (val) {
        !unref(isDone) && addEventListener(val);
        cleanup(() => {
          removeEventListener(val);
        });
      }
    },
    { immediate: true },
  );
}
