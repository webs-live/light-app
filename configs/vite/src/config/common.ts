import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
// @ts-ignore: type unless
import DefineOptions from 'unplugin-vue-define-options/vite';
import { type UserConfig } from 'vite';

export function commonConfig(env: Record<string, any>): UserConfig {
  const { VITE_DROP_CONSOLE } = env;
  return {
    server: {
      host: true,
    },
    esbuild: {
      drop: VITE_DROP_CONSOLE == 'true' ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: true,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 1500,
    },
    plugins: [vue(), vueJsx(), DefineOptions()],
  };
}
