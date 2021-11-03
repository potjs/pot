import type { App } from 'vue';
import type { RouterOptions, Router, RouteRecordRaw } from 'vue-router';
import type {
  AjsLayout,
  AjsNotfound,
  AjsRouterHooks,
  AjsRouterOptions,
  AjsRouteRecordRaw,
  AjsRoute,
  GenerateComponentWithRoute,
} from './types';

import { createRouter } from 'vue-router';
import { useNotfound } from './useComponent';

function noop() {}

function randomId(len = 10) {
  return Math.random().toString(36).substr(2, len);
}

/**
 * Create a router instance
 */
export default class AjsRouter {
  readonly router: Router;
  readonly layout: AjsLayout;
  readonly notfound: AjsNotfound;
  private _routes: AjsRouteRecordRaw[] = [];

  public get routes() {
    return this._routes;
  }

  private set routes(theRoutes: AjsRouteRecordRaw[]) {
    this._routes = [...theRoutes];
  }

  constructor(routerOptions: AjsRouterOptions, hooks?: AjsRouterHooks) {
    const { layout, notfound, ...options } = routerOptions;
    this.layout = layout;
    this.notfound = notfound;
    this.router = createRouter(options as RouterOptions);

    // set 404 page
    this.router.addRoute(useNotfound(this.notfound, this.layout));

    // set all hooks
    this.setupHooks(hooks);
  }

  /**
   * Vue app.use
   */
  install(app: App<Element>): void {
    app.use(this.router);
  }

  setupRoutes(__: AjsRoute[], predicate?: GenerateComponentWithRoute): AjsRouteRecordRaw[] {
    this.routes = this.generateRoute(__, undefined, predicate);
    // add routes to router
    this.router.addRoute({
      path: '/',
      name: this.layout.name,
      component: this.layout.component,
      meta: this.layout.meta,
      children: this.routes as RouteRecordRaw[],
    });

    return this.routes;
  }

  /**
   * setup router global hooks
   * @private
   */
  private setupHooks(hooks: AjsRouterHooks = {}): void {
    const { beforeEach, beforeResolve, afterEach } = hooks;

    // FIXME: should be fix this code
    // for (const [key, hook] of Object.entries(hooks)) {
    //   if (Array.isArray(hook)) {
    //     for (const fn of hook) {
    //       this.router[key](fn);
    //     }
    //   } else {
    //     this.router[key](hook);
    //   }
    // }
    if (beforeEach) {
      if (Array.isArray(beforeEach)) {
        for (const fn of beforeEach) {
          this.router.beforeEach(fn);
        }
      } else {
        this.router.beforeEach(beforeEach);
      }
    }

    if (beforeResolve) {
      if (Array.isArray(beforeResolve)) {
        for (const fn of beforeResolve) {
          this.router.beforeResolve(fn);
        }
      } else {
        this.router.beforeResolve(beforeResolve);
      }
    }

    if (afterEach) {
      if (Array.isArray(afterEach)) {
        for (const fn of afterEach) {
          this.router.afterEach(fn);
        }
      } else {
        this.router.afterEach(afterEach);
      }
    }
  }

  /**
   * generate route for permission
   * @private
   */
  private generateRoute(
    __: AjsRoute[],
    parent?: AjsRouteRecordRaw,
    predicate: GenerateComponentWithRoute = noop,
  ): AjsRouteRecordRaw[] {
    return __.map((item) => {
      const { path, name, component, redirect, children, ...meta } = item;
      const rePath = `${(parent && parent.path) || ''}/${path}`.replace('//', '/');
      const currentRoute: AjsRouteRecordRaw = {
        path: rePath,
        name: name || randomId(),
        component: predicate(item, rePath) || component,
        meta: {
          ...meta,
        },
        ...(redirect && {
          redirect: redirect,
        }),
      };
      if (children && children.length) {
        currentRoute.children = this.generateRoute(children, currentRoute, predicate);
      }
      return currentRoute;
    });
  }
}
