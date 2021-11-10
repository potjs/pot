import type { App } from 'vue';
import PotTable from './table';

PotTable.install = function (app: App) {
  app.component(PotTable.name, PotTable);
  return app;
};

export { PotTable };
