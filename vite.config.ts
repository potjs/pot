import type { UserConfig } from 'vite';
import { loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ mode }): UserConfig => {
  const root = process.cwd();

  const { VITE_PUBLIC_PATH, VITE_PORT } = loadEnv(mode, root);

  return {
    base: VITE_PUBLIC_PATH,
    root,

    plugins: [vue()],

    resolve: {
      alias: [
        {
          find: /\/@\//,
          replacement: pathResolve('src') + '/',
        },
        {
          find: /\/#\//,
          replacement: pathResolve('typings') + '/',
        },
      ],
    },

    css: {
      preprocessorOptions: {
        less: {
          modifyVars: {
            // custom theme
            // 'pot-menu-item-active-color': '#e37171',
            // 'pot-submenu-item-active-color': '#e37171',
          },
          javascriptEnabled: true,
        },
      },
    },

    server: {
      // Listening on all local IPs
      host: true,
      port: Number(VITE_PORT),
    },
  };
};
