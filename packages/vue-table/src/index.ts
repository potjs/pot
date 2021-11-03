import type { App } from 'vue';
import AjsTable from './table';

AjsTable.install = function (app: App) {
  app.component(AjsTable.name, AjsTable);
  return app;
};

export { AjsTable };
