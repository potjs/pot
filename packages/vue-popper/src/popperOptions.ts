/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/popper-options.ts
 */
import { computed } from 'vue';
import buildModifiers from './buildModifiers';

import type { Ref } from 'vue';
import type { Options, Placement } from '@popperjs/core';

interface IUsePopperProps {
  popperOptions: Partial<Options>;
  arrowOffset: number;
  offset: number;
  placement: Placement;
  gpuAcceleration: boolean;
  fallbackPlacements: Array<Placement>;
}

export interface IUsePopperState {
  arrow: Ref<HTMLElement>;
}

export default function usePopperOptions(props: IUsePopperProps, state: IUsePopperState) {
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
