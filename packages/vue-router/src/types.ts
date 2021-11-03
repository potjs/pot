import type {
  RouteMeta,
  NavigationGuardWithThis,
  NavigationHookAfter,
  RouteRecordRaw,
  RouterOptions,
} from 'vue-router';
import { defineComponent } from 'vue';

export type Component<T extends any = any> =
  | ReturnType<typeof defineComponent>
  | (() => Promise<typeof import('*.vue')>)
  | (() => Promise<T>);

export interface AjsLayout {
  name: string;
  component: Component;
  meta: RouteMeta;
}

export interface AjsNotfound {
  name?: string;
  component: Component;
  root?: boolean;
  meta: RouteMeta;
}

export interface AjsRouterHooks extends Record<string, any> {
  beforeEach?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
  beforeResolve?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
  afterEach?: NavigationHookAfter | NavigationHookAfter[];
}

export interface AjsRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: AjsRouteRecordRaw[];
}

export interface AjsRouterOptions extends Omit<RouterOptions, 'routes'> {
  routes: AjsRouteRecordRaw[];
  layout: AjsLayout;
  notfound: AjsNotfound;
}

export interface AjsRoute {
  name?: string;
  path: string;
  title: string;
  component?: Component;
  children?: AjsRoute[];
  redirect?: string;
  icon?: string;
  hide?: boolean;
  [s: string]: any;
}

export interface GenerateComponentWithRoute {
  (item: AjsRoute, path: string): Component;
}
