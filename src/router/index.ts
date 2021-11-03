import type { App } from 'vue';
import { createWebHashHistory } from 'vue-router';
import type { AjsRouteRecordRaw } from '@potjs/vue-router';
import { AjsRouter } from '@potjs/vue-router';

import Layout from '/@/layout/index.vue';
import { store } from '/@/store';

// exports all single file components
const viewModules = import.meta.glob('../views/**/*.vue');
export const modules = Object.keys(viewModules).reduce((modules, modulePath) => {
  // '/views/dashboard/index.vue' -> '/dashboard/index'
  const moduleName = modulePath.replace(/^\..\/views(\/.*)\.\w+$/, '$1');
  modules[moduleName] = viewModules[modulePath];
  return modules;
}, {});

export const basicRoutes: AjsRouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('/@/views/login/index.vue'),
    meta: {},
  },
  {
    path: '/',
    name: 'Root',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('/@/views/dashboard/index.vue'),
        meta: {},
      },
    ],
    meta: {},
  },
];

export const router = new AjsRouter(
  {
    history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
    routes: basicRoutes,
    layout: {
      name: 'Layout',
      component: Layout,
      meta: {},
    },
    notfound: {
      name: 'NOT_FOUND',
      component: () => import('/@/views/404.vue'),
      meta: {
        title: 'PageNotFound',
      },
    },
    scrollBehavior: () => ({ left: 0, top: 0 }),
  },
  {
    beforeEach: async (to, from, next) => {
      if (!router.routes.length) {
        await store.dispatch('GenerateRoutes');
        console.log('#routes', router.routes);
      }

      if (to.name === 'NOT_FOUND') {
        // 动态添加路由后，此处应当重定向到fullPath，否则会加载404页面内容
        next({ path: to.fullPath, replace: true, query: to.query });
      } else {
        next();
      }
    },
  },
);

// function listToTree(list) {
//   const info = list.reduce((map, node) => {
//     map[node.id] = node;
//     node.children = [];
//     return map;
//   }, {});
//   return list.filter((node) => {
//     info[node.parentId] && info[node.parentId].children.push(node);
//     return !node.parentId;
//   });
// }

export function setupRouter(app: App<Element>) {
  app.use(router);
}
