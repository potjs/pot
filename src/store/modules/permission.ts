import { router, modules } from '/@/router';
import testData from '/@/router/test.tree.json';
import Noop from '/@/layout/noop.vue';

export default {
  state: {
    routes: [],
  },

  mutations: {
    SET_ROUTES: (state, routes) => {
      state.routes = [...routes];
    },
  },

  actions: {
    GenerateRoutes({ commit }) {
      const routes = router.setupRoutes(testData, (route, path) => {
        // console.log(path, modules[path]);
        return modules[path] || Noop;
      });
      commit('SET_ROUTES', routes);
    },
  },
};
