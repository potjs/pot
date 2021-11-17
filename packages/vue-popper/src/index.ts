import Popper from './Popper';

import type { App, Plugin } from 'vue';

Popper.install = (app: App): App => {
  app.component(Popper.name, Popper);
  return app;
};

export default Popper as typeof Popper & Plugin;

export * from './defaultSetting';
export * from './renderers';
export { usePopper } from './usePopper';
export type { Placement, Options, Instance as PopperInstance } from '@popperjs/core';
export type { EmitType } from './usePopper';
