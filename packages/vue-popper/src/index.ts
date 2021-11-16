import Popper from './Popper';

import type { App } from 'vue';

Popper.install = (app: App): void => {
  app.component(Popper.name, Popper);
};

export default Popper;

export { defaultPopperProps, Effect } from './use-popper/defaults';
export * from './renderers';
export { default as usePopper } from './use-popper';
export type { Placement, Options, Instance as PopperInstance } from '@popperjs/core';
export type { EmitType } from './use-popper';
export type { TriggerType, IPopperOptions } from './use-popper/defaults';
