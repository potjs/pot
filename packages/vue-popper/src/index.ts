import Popper from './Popper';

import type { App, Plugin } from 'vue';

Popper.install = (app: App): void => {
  app.component(Popper.name, Popper);
};

export default Popper as typeof Popper & Plugin;

export { defaultPopperProps, Effect } from './use-popper/defaults';
export * from './renderers';
export { usePopper } from './use-popper';
export type { Placement, Options, Instance as PopperInstance } from '@popperjs/core';
export type { EmitType } from './use-popper';
export type { TriggerType, IPopperOptions } from './use-popper/defaults';
