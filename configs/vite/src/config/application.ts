import { resolve } from 'path';
import { readPackageJSON } from 'pkg-types';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';
import dayjs from 'dayjs';
import { createPlugins } from '../plugins';
import { commonConfig } from './common';
import { warmup } from 'vite-plugin-warmup';
import UnoCSS from 'unocss/vite';
import { presetTypography, presetUno } from 'unocss';
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from 'unplugin-vue-components/resolvers';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

export function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE, VITE_DROP_CONSOLE } = loadEnv(
      mode,
      root,
    );

    const getCommonConfig = commonConfig({ VITE_DROP_CONSOLE });
    const defineData = await createDefineData(root);
    const plugins = await createPlugins({
      isBuild,
      root,
      enableAnalyze: VITE_ENABLE_ANALYZE == 'true',
      enableMock: VITE_USE_MOCK == 'true',
      compress: VITE_BUILD_COMPRESS,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);
    const applicationConfig: UserConfig = {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: `@use '@app/design/shared' as *;`,
          },
        },
      },
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
          // #/xxxx => types/xxxx
          {
            find: /#\//,
            replacement: pathResolve('types') + '/',
          },
        ],
      },
      define: defineData,
      build: {
        rollupOptions: {
          output: {
            chunkFileNames: 'js/[name]-[hash].js',
            entryFileNames: 'js/_entry-[name]-[hash].js',
            assetFileNames: '[ext]/[name]-[hash].[ext]',
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router'],
            },
          },
        },
      },
      plugins: [
        ...plugins,
        warmup({
          clientFiles: ['./*.html'],
        }),
        UnoCSS({
          exclude: ['node_modules'],
          include: ['**.ts', '**.tsx', '**.vue'],
          presets: [presetUno(), presetTypography()],
        }),
        Components({
          resolvers: [VantResolver()],
        }),
      ],
    };

    const mergedConfig = mergeConfig(getCommonConfig, applicationConfig);

    return mergeConfig(mergedConfig, overrides);
  });
}

async function createDefineData(root: string) {
  try {
    const pkgJson = await readPackageJSON(root);
    const { dependencies, devDependencies, name, version } = pkgJson;

    const __APP_INFO__ = {
      pkg: { dependencies, devDependencies, name, version },
      lastBuildTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    return {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    };
  } catch (error) {
    return {};
  }
}
