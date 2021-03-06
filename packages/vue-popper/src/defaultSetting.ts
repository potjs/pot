/**
 * modified from https://github.com/element-plus/element-plus/blob/master/packages/components/popper/src/use-popper/defaults.ts
 */
import type { Options, Placement, PositioningStrategy } from '@popperjs/core';
import type { PropType } from 'vue';

export type Nullable<T> = T | null;
export type TimeoutHandle = ReturnType<typeof setTimeout>;

export enum Effect {
  DARK = 'dark',
  LIGHT = 'light',
}

export type RefElement = Nullable<HTMLElement>;
export type Offset = [number, number] | number;
export type { Placement, PositioningStrategy, Options };

export type TriggerType = 'click' | 'hover' | 'focus' | 'manual';

export type Trigger = TriggerType | TriggerType[];

export type PopperOptions = {
  arrowOffset: number;
  autoClose: number;
  boundariesPadding: number;
  class: string;
  cutoff: boolean;
  disabled: boolean;
  enterable: boolean;
  hideAfter: number;
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

export const defaultPopperProps = {
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
    type: [Boolean, String],
    default: false,
  },
  strategy: {
    type: String as PropType<PositioningStrategy>,
    default: 'fixed' as PositioningStrategy,
  },
  transition: {
    type: String,
    default: 'fade',
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
