import type { App } from 'vue';

export type { PotLayoutProps } from './Layout';
export { default as PotLayout } from './Layout';
import PotLayout from './Layout';

export type { PotMenuProps } from './Menu';
export { default as PotMenu } from './Menu';
import PotMenu from './Menu';

export const install = function (app: App) {
  app.use(PotLayout);
  app.use(PotMenu);
  return app;
};
