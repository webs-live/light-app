import { defineApplicationConfig, getEnvConfig } from '@app/vite';

const env = getEnvConfig();

export default defineApplicationConfig({
  overrides: {
    base: env.VITE_PUBLIC_PATH,
    optimizeDeps: {
      include: [],
    },
    server: {
      proxy: {
        '/light-app/open-api/storage-manager': {
          target: env.VITE_GLOB_API_ENGINE_URL,
          changeOrigin: true,
          ws: true,
          // only https
          // secure: false
        },
        // '/light-app/open-api/stream-manager': {
        //   target: 'http://192.168.3.84:7005',
        //   changeOrigin: true,
        //   ws: true,
        //   // only https
        //   // secure: false
        // },
        // '/light-app/open-api/iot-manager': {
        //   target: 'http://192.168.3.84:7005',
        //   changeOrigin: true,
        //   ws: true,
        //   // only https
        //   // secure: false
        // },
        // '/light-app/open-api/v1': {
        //   target: env.VITE_GLOB_API_URL,
        //   changeOrigin: true,
        //   ws: true,
        //   rewrite: (path) => {
        //     return path.replace(new RegExp(`^/light-app/open-api`), '');
        //   },
        // 预发环境-UAT环境
        '/light-app/open-api': {
          target: env.VITE_GLOB_API_URL,
          changeOrigin: true,
          ws: true,
          // rewrite: (path) => {
          //   return path.replace(new RegExp(`^/light-app/open-api`), '');
          // },
          // only https
          // secure: false
        },
        // 本地开发
        '/light-app/open-api/v1': {
          target: env.VITE_GLOB_API_URL,
          changeOrigin: true,
          ws: true,
          rewrite: (path) => {
            // 拦截器
            return path.replace(new RegExp(`^/light-app/open-api`), '');
          },
        },
      },
    },
  },
});
