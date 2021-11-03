import type { AjsLayout, AjsNotfound } from './types';

export function useNotfound(args: AjsNotfound, layout: AjsLayout) {
  const { name = 'PAGE_NOT_FOUND', component, root = true, meta } = args;
  return {
    path: '/:path(.*)*',
    name,
    component: root ? layout.component : component,
    meta: root ? layout.meta : meta,
    ...(root && {
      children: [
        {
          path: '',
          name,
          component,
          meta,
        },
      ],
    })
  };
}
