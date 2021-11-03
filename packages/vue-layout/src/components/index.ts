import type { App } from 'vue';
import * as components from './components';
export * from './components';

export const install = function (app: App) {
  Object.values(components).forEach((comp) => {
    if (comp.install) {
      app.use(comp);
    }
  });
  return app;
};
