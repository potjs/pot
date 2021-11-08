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

export interface PotLayout {
  name: string;
  component: Component;
  meta: RouteMeta;
}

export interface PotNotfound {
  name?: string;
  component: Component;
  root?: boolean;
  meta: RouteMeta;
}

export interface PotRouterHooks extends Record<string, any> {
  beforeEach?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
  beforeResolve?: NavigationGuardWithThis<undefined> | NavigationGuardWithThis<undefined>[];
  afterEach?: NavigationHookAfter | NavigationHookAfter[];
}

export interface PotRouteRecordRaw extends Omit<RouteRecordRaw, 'meta' | 'children'> {
  name: string;
  meta: RouteMeta;
  component?: Component | string;
  components?: Component;
  children?: PotRouteRecordRaw[];
}

export interface PotRouterOptions extends Omit<RouterOptions, 'routes'> {
  routes: PotRouteRecordRaw[];
  layout: PotLayout;
  notfound: PotNotfound;
}

export interface PotRoute {
  name?: string;
  path: string;
  title: string;
  component?: Component;
  children?: PotRoute[];
  redirect?: string;
  icon?: string;
  hide?: boolean;
  [s: string]: any;
}

export interface GenerateComponentWithRoute {
  (item: PotRoute, path: string): Component;
}
