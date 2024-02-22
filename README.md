## 项目启动

1. 加载项目依赖并打包配置文件

```JavaScript
pnpm bootstrap
```

> 为了减少一些不必要的错误，请使用此命令安装依赖

2. `cd` 到 `apps/` 下任意项目执行命令

```JavaScript
pnpm dev
```

## 代码提交

```JavaScript
pnpm commit
```

## 轻应用前端架构

## 简介

1. 项目采用 Monorepo 进行项目代码管理，Monorepo 是指单个仓库中管理多个项目，有助于简化代码共享、版本控制、构建和部署等方面的复杂性，并提供更好的可重用性和协作性。Monorepo 提倡了开放、透明、共享的组织文化，这种方法已经被很多大型公司广泛使用，如 Google、Facebook 和 Microsoft 等

## Monorepo 优势

- 一个仓库中多个相关项目，很容易看到整个代码库的变化趋势，更好的团队协作。
- 多项目代码都在一个仓库中，相同版本依赖提升到顶层只安装一次，节省磁盘内存。
- 多个项目都在一个仓库中，可看到相关项目全貌，编码非常方便。
- 代码复用高，方便进行代码重构。
- 依赖调试方便，依赖包迭代场景下，借助工具自动 npm link，直接使用最新版本依赖，简化了操作流程。
- 多项目在一个仓库，工程配置一致，代码质量标准及风格也很容易一致。
- 构建性 Monorepo 工具可以配置依赖项目的构建优先级，可以实现一次命令完成所有的部署。

## Monorepo 使用场景

中大型项、多模块项目、多项目，适合用 Monorepo 方式管理代码，在开发、协作效率、代码一致性方面都能受益。

## 架构图

![img](https://gitee.com/lzdjack-docs/assets/raw/master/1280X1280.PNG)

## 技术栈

以下技术栈我会挑选个别重要的包进行讲解，更详细的请查看代码理解

- [Turborepo](https://turborepo.org)
- Vue3.x
- pinia
- vue-router
- Vitejs
- typescript
- @videojs-player/vue + video.js
- unocss
- qs
- vconsole
- dayjs
- axios
- lodash-es
- vant

## 创建 Monorepo 项目结构

```JavaScript
pnpm dlx create-turbo@latest
```

![img](<https://gitee.com/lzdjack-docs/assets/raw/master/1280X1280%20(1).PNG>)

以下是对当前目录的简单解析，具体实现在下面会选择性解释

注：在下面会出现@xx/xxx 格式这个理解为插件名/npm 包名，可以在 packabg.json 查找对应 name 名称

- .vscode 对 vscode 开发软件的基本配置
- apps 是多项目的结构目录（业务代码）
- configs 工程化的配置
- node_modules 多项目依赖的插件包
- packages 每个项目所依赖的包
- bs-ui 二次开发的业务组件
- design 多项目依赖的样式框架
- Hooks 多项目依赖的钩子函数
- Service 第三方服务接口（如：环境（相当于 jssdk）
- Shared 多项目依赖的工具类
- Types TypeScript 项目声明的类型文件
- Ui 多项目依赖的自定义 ui
- .eslintrc.js 代码检查配置
- .prettierrc.js 代码格式化配置
- .d.ts 对 ts 的全局声明
- packabg.json 记载项目所需的依赖和项目信息
- tsconfig.json 对于 TypeScript 的配置文件
- Vitejs 配置文件

## @app/prettier

实现自定义代码格式化

```Plain
pnpm add --dev prettier prettier-plugin-packagejson unbuild
```

> 1. [prettier](https://www.prettier.cn/)：代码格式化工具
> 2. [prettier-plugin-packagejson](https://github.com/matzkoh/prettier-plugin-packagejson)：增加对 packjack.json 文件格式化的支持
> 3. [unbuild](https://github.com/unjs/unbuild)：支持 typescript 并生成 commonjs 和 esmoudle 格式+类型声明。为什么需要此包，因为有些插件不支持某些格式，因此转换为通用模块格式来使用

### 创建 prettier 配置文件并写入配置内容

```JavaScript
// configs/prettier/src/index.ts
export default {
  printWidth: 100,
  semi: true,
  vueIndentScriptAndStyle: true,
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '.*rc',
      options: {
        parser: 'json',
      },
    },
  ],
};
```

### 在项目根本录下执行命令

```Haskell
// package.json
pnpm add -D @app/prettier
```

### 在项目根目录下建立.prettierrc.js 并引用@app/prettier 包

```JavaScript
// .prettierrc.js
module.exports = {
  ...require('@app/prettier'),
};
```

### 在项目根目录下建立.prettierignore 要忽略的文件

```Plain
/dist/*
/node_modules/**
**/*.svg
**/*.sh
/public/*
```

### 添加 package.json 配置

```Plain
"format": "prettier --write src/"
```

## @app/eslint

代码检查插件

```Plain
pnpm add --dev @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-prettier eslint-define-config eslint-plugin-import eslint-plugin-jsonc eslint-plugin-n eslint-plugin-prettier eslint-plugin-regexp eslint-plugin-simple-import-sort eslint-plugin-vue jsonc-eslint-parser vue-eslint-parser unbuild
```

> 此包/插件 需要依赖的包比较多，在这里我就不一一解释了，需要查看每个包的功能请去[npm](https://www.npmjs.com/)官网查看

### 创建 eslint 配置文件并写入配置内容

```JavaScript
// configs/eslint/src/index.ts

import { defineConfig } from 'eslint-define-config';

export default defineConfig({
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:jsonc/recommended-with-jsonc',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:n/recommended',
    'plugin:import/recommended',
    'plugin:regexp/recommended',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
    jsxPragma: 'React',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.*?.json',
    createDefaultProgram: false,
    extraFileExtensions: ['.vue'],
  },
  plugins: ['vue', '@typescript-eslint', 'import', 'simple-import-sort'],
  rules: {
    'prettier/prettier': 'error',
    eqeqeq: ['warn', 'always', { null: 'never' }],
    'no-console': 'warn',
    'no-unused-vars': 'off',
    'no-case-declarations': 'off',
    'no-use-before-define': 'off',
    'no-empty-function': 'off',
    'no-empty': ['warn', { allowEmptyCatch: true }],
    'no-debugger': 'error',
    'keyword-spacing': 'off',
    'space-before-function-paren': 'off',
    'prefer-const': [
      'error',
      {
        destructuring: 'all',
      },
    ],
    'object-shorthand': ['error', 'always', { ignoreConstructors: false, avoidQuotes: true }],

    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
    'n/no-unsupported-features/es-syntax': [
      'error',
      {
        version: '>=18.0.0',
        ignores: [],
      },
    ],
    'n/no-extraneous-import': [
      'error',
      {
        allowModules: ['unbuild', '@vben/vite-config', 'vitest'],
      },
    ],

    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',

    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-unresolved': 'off',

    '@typescript-eslint/no-namespace': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-types': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-expect-error': 'allow-with-description',
        'ts-ignore': 'allow-with-description',
        'ts-nocheck': 'allow-with-description',
        'ts-check': false,
      },
    ],
    '@typescript-eslint/keyword-spacing': [
      'error',
      {
        before: true,
        after: true,
        overrides: {
          return: { after: true },
          throw: { after: true },
          case: { after: true },
        },
      },
    ],
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['arrowFunctions', 'functions', 'methods'],
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],

    'vue/attributes-order': 'error',
    'vue/require-default-prop': 'error',
    'vue/require-explicit-emits': 'error',
    'vue/prefer-import-from-vue': 'error',
    'vue/multiline-html-element-content-newline': 'error',
    'vue/html-closing-bracket-newline': 'error',
    'vue/one-component-per-file': 'error',
    'vue/custom-event-name-casing': 'error',
    'vue/script-setup-uses-vars': 'error',
    'vue/no-reserved-component-names': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always',
        },
        svg: 'always',
        math: 'always',
      },
    ],
    'vue/multi-word-component-names': 'off',
  },
  overrides: [
    {
      files: ['*.json', '*.json5', '*.jsonc'],
      parser: 'jsonc-eslint-parser',
    },
    {
      files: ['**.test.ts'],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['package.json'],
      parser: 'jsonc-eslint-parser',
      rules: {
        'jsonc/sort-keys': 'off',
      },
    },
  ],
  globals: { defineOptions: 'readonly' },
  ignorePatterns: ['**/vendor/**', '**/dist/**', '**/node_modules/**'],
  settings: {
    'import/resolver': {
      node: { extensions: ['.ts', '.d.ts', '.tsx'] },
    },
    'import/ignore': ['node_modules'],
  },
});
```

### 在项目根目录下创建.eslintrc.js 并引用@app/eslint 包

```Plain
// .eslint.js
module.exports = {
  root: true,
  extends: ['@app/eslint'],
};
```

### 根目录下创建.eslintignore 并填写配置

```Plain
*.sh
node_modules
*.md
*.woff
*.ttf
.vscode
.idea
dist
/public
/docs
.husky
.local
/bin
Dockerfile
```

### 添加 package.json 配置

```Plain
"lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
```

> 注：安装完插件并且配置好.eslintrc.js 后如果没有生效，必要时请重启 vscode!!!，这个方法适用于所有不生效的插件

## @app/ts

Typescript 的配置文件包

### 创建 ts 配置文件

1. base.josn 公共的配置文件

```JSON
// configs/ts/src/base.json

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Base",
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "noImplicitOverride": true,
    "noUnusedLocals": true,
    "esModuleInterop": true,
    "useUnknownInCatchVariables": false,
    "composite": false,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": false,
    "isolatedModules": true,
    "skipLibCheck": true,
    "noUnusedParameters": true,
    "preserveWatchOutput": true,
    "experimentalDecorators": true,
    "resolveJsonModule": true,
    "removeComments": true,
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": false,
    "strictNullChecks": true
  },
  "exclude": ["**/node_modules/**", "**/dist/**", "**/.turbo/**"]
}
```

1. node.json 在服务端使用的 ts 配置环境，如在@app/vite 包中使用

```Plain
// configs/ts/src/node.json

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Node Config",
  "extends": "./base.json",
  "compilerOptions": {
    "lib": ["ESNext"],
    "noImplicitAny": true,
    "sourceMap": true,
    "baseUrl": "./",
    "composite": false,
    "allowSyntheticDefaultImports": true
  }
}
```

1. web.json 在前端使用的 ts 配置环境

```Plain
// configs/ts/src/web.json

{
  "$schema": "https://json.schemastore.org/tsconfig",
  "display": "Web Application",
  "extends": "./base.json",
  "compilerOptions": {
    "useDefineForClassFields": true,
    "jsx": "preserve",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "noImplicitAny": false,
    "types": ["vite/client"]
  }
}
```

### 在项目根目录下创建 tsconfig.json 并引用@app/ts 包

```Plain
// tsconfig.json
{
  "$schema": "https://json.schemastore.org/tsconfig",
  "extends": "app/ts/web.json",
  "compilerOptions": {
    "baseUrl": ".",
    "moduleResolution": "node",
    "types": ["vite/client", "unplugin-vue-define-options/macros-global"],
    "paths": {
      "@/*": ["src/*"],
      "#/*": ["types/*"]
    }
  },
  "vueCompilerOptions": {
    "target": 3,
    "plugins": ["@vue-macros/volar/define-options"]
  },
  "include": ["src", "mock", "vite.config.ts", "package.json"]
}
```

## @app/vite

打包工具

```Plain
pnpm add --dev @types/fs-extra @vitejs/plugin-vue chalk dayjs dotenv fs-extra mockjs picocolors pkg-types rollup-plugin-visualizer sass unocss unplugin-vue-components vite vite-plugin-compression vite-plugin-dts vite-plugin-html vite-plugin-mock vite-plugin-purge-icons vite-plugin-svg-icons vite-plugin-warmup unbuild
```

> 此包/插件 需要依赖的包比较多，在这里我就不一一解释了，需要查看每个包的功能请去[npm](https://www.npmjs.com/)官网查看

### 创建 vite.config.ts 配置文件并写入配置内容

```Plain
// configs/vite/src/index.ts

import { resolve } from 'path';
import { readPackageJSON } from 'pkg-types';
import { defineConfig, loadEnv, mergeConfig, type UserConfig } from 'vite';
import dayjs from 'dayjs';
import { createPlugins } from '../plugins';
import { commonConfig } from './common';
import colors from 'picocolors';
import { warmup } from 'vite-plugin-warmup';

interface DefineOptions {
  overrides?: UserConfig;
  options?: {};
}

export function defineApplicationConfig(defineOptions: DefineOptions = {}) {
  console.log();
  console.log(
    colors.bgBlue('当前处于开发测试阶段，还会有大量更新，仅供参考，请勿用于实际项目！\n'),
  );
  console.log();
  const { overrides = {} } = defineOptions;

  return defineConfig(async ({ command, mode }) => {
    const root = process.cwd();
    const isBuild = command === 'build';
    const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_ENABLE_ANALYZE } = loadEnv(mode, root);

    const defineData = await createDefineData(root);
    const plugins = await createPlugins({
      isBuild,
      root,
      enableAnalyze: VITE_ENABLE_ANALYZE === 'true',
      enableMock: VITE_USE_MOCK === 'true',
      compress: VITE_BUILD_COMPRESS,
    });

    const pathResolve = (pathname: string) => resolve(root, '.', pathname);
    const applicationConfig: UserConfig = {
      resolve: {
        alias: [
          {
            find: /@\//,
            replacement: pathResolve('src') + '/',
          },
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
      ],
    };

    const mergedConfig = mergeConfig(commonConfig, applicationConfig);

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
```

这些是我目前项目的配置,接下来我会一步步讲解

- root: 添加项目的根目录

```Plain
const root = process.cwd();
```

> 别问我为什么这么写,官方文档(https://cn.vitejs.dev/config/#root)有写

- base: 开发或生产环境服务的公共基础路径

```Plain
const env = loadEnv(mode, root);
const viteEnv = wrapperEnv(env);
const { VITE_BASE_URL, VITE_PORT, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv;
```

> 这里稍微麻烦些,因为在 vite.config.ts 中并不能直接用`import.meta.env`直接获取配置文件的参数,因此得
>
> 用 vite 插件自带的`loadEnv`函数去获取`env`

```Plain
// build/vite/utils.ts
export function wrapperEnv(envConf: Recordable): ViteEnv {
  const ret: any = {};

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) {
        console.error(error);
      }
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}
```

> 写这个函数主要是为了解析`env`里的参数,因为上面`loadEnv`函数获取的参数都是字符串,但是往往我们配置的
>
> 文件还会有`Array`,`Boolean`等类型的,而且在`wrapperEnv`函数里为了我们以后方便使用,最后都放到了 process.env 里

```Plain
declare type Recordable<T = any> = Record<string, T>;

declare interface ViteEnv {
  VITE_PORT: number;
  VITE_USE_MOCK: boolean;
  VITE_USE_PWA: boolean;
  VITE_BASE_URL: string;
  VITE_PROXY: [string, string][];
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_USE_CDN: boolean;
  VITE_DROP_CONSOLE: boolean;
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
  VITE_LEGACY: boolean;
  VITE_USE_IMAGEMIN: boolean;
  VITE_GENERATE_UI: string;
}
```

> 这里为了有友好的提示,我们增加了类型声明文件,官网(https://cn.vitejs.dev/guide/env-and-mode.html#env-files)也有说明

- plugins: 需要用到的插件数组

```Plain
// configs/vite/src/plugins
import type { Plugin } from 'vite';
import vue from '@vitejs/plugin-vue';

export default function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  console.log(viteEnv, isBuild);

  const vitePlugins: (Plugin | Plugin[])[] = [vue()];
  return vitePlugins;
}
```

> 这里我直接新建了文件夹，是处理有关插件和打包的文件
>
> 这里可以根据`viteEnv`和`isBuild`来判断不同环境间所需要加载的插件
>
> 这里我整理了 vitejs 开发 web 项目的部分插件

![img](https://gitee.com/lzdjack-docs/assets/raw/master/400de985-7031-479e-9a5c-ef337b1b7b92.png)

- resolve： 当使用文件系统路径的别名时，请始终使用绝对路径。相对路径的别名值会原封不动地被使用，因此无法被正常解析。

![img](https://gitee.com/lzdjack-docs/assets/raw/master/fde502dc-49ae-4c95-a5a8-e7c273dfc5a5.png)

> 比如在 tsconfig.json 添加了路径别名，那么在 vite.config.ts 文件就要做解析

- build: 构建选项

这里 build 的东西比较多，就不多说了官方都有说明，如果 vitejs 的打包功能不能满足你那么可以借助[Rollup](https://rollupjs.org/)来进行扩展

### 打包静态文件生成全局变量设置

一个项目可能需要全局静态变量,那么我们就需要在打包的时候全局挂载,这样做的好处是是可以在服务器上直接修

改文件源码而不需要重新打包,那么接下来看看如何处理这个问题

在我们项目中,外部可能需要添加全局配置文件`_app_config.js`,那么具体思路如下:

1. 获取全局变量配置,这里需要 dotenv 包配合获取带{key, value}键值对格式的值
2. 获取全局变量的 key 值(window.xxx)
3. 拼接静态数据
4. 根据 nodejs 创建文件夹,创建`_app_config.js`文件,写入数据
5. 利用`vite-plugin-html`包把`_app_config.js`引入到`.html`文件中,之后就能到用到全局静态数据啦

```Plain
import { getConfigEnv, getConfigFileName, getRootPath } from '../vite/utils';
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant';
import { writeFileSync, mkdirp } from 'fs-extra';
import chalk from 'chalk';
import pkg from '../../package.json';

interface ConfigBuildArg {
  config: ViteEnv;
  configName: string;
  configFileName?: string;
}

const createConfig = ({
  config,
  configName,
  configFileName = GLOB_CONFIG_FILE_NAME,
}: ConfigBuildArg) => {
  try {
    const windowConf = `window.${configName}`;
    const configStr = `${windowConf}=${JSON.stringify(
      config
    )}; Object.freeze(${windowConf});Object.defineProperty(window, "${configName}", {
            configurable: false,
            writable: false,
          });`.replace(/\s/g, '');
    mkdirp(getRootPath(OUTPUT_DIR));
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr);
    console.log(chalk.cyan(`✨ [${pkg.name}]`) + ` - configuration file is build successfully:`);
    console.log(chalk.gray(`${OUTPUT_DIR}/${configFileName}\n`));
  } catch (error) {
    console.log(chalk.red('configuration file configuration file failed to package:\n' + error));
  }
};

export const runBuild = () => {
  try {
    const config = getConfigEnv();
    const configFileName = getConfigFileName(config);
    createConfig({ config, configName: configFileName });
    console.log(`✨ ${chalk.cyan(`[${pkg.name}]`)}` + ' - build successfully!');
  } catch (error) {
    console.log(chalk.red('vite build error:\n' + error));
  }
};

runBuild();
/**
 * 获取正式环境,全局变量的值
 */
export function getConfigEnv(
  match = 'VITE_GLOB_',
  confFiles = ['.env', '.env.production']
): ViteEnv {
  let envConfig = {};
  try {
    confFiles.forEach((item) => {
      const env = dotenv.parse(readFileSync(getRootPath(item)));
      envConfig = { ...envConfig, ...env };
    });
  } catch (error) {}

  Object.keys(envConfig).forEach((item) => {
    const reg = new RegExp(`^(${match})`);
    if (!reg.test(item)) {
      Reflect.deleteProperty(envConfig, item);
    }
  });
  return envConfig as ViteEnv;
}

/**
 * 获取全局静态数据key
 */
export function getConfigFileName(env: ViteEnv) {
  return `__PRODUCTION__${env.VITE_GLOB_APP_SHORT_NAME || '__APP'}__CONF__`
    .toUpperCase()
    .replace(/\s/g, '');
}

/**
 * 获得图片路径
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}
```

### 在项目根目录下建立 vite.config.ts 并引用@app/vite 包

```Plain
// vite.config.ts
import { defineApplicationConfig } from '@app/vite';

export default defineApplicationConfig({
  overrides: {
    base: './',
    optimizeDeps: {
      include: [],
    },
    server: {
      proxy: {
        '/light-app': {
          target: 'http://192.168.3.50:9080',
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(new RegExp(`^/light-app/open-api`), ''),
          // only https
          // secure: false
        },
      },
    },
  },
});
```

添加 package.json 配置

```Plain
"dev": "vite"
```

## 设置 vscode 工作区配置

设置 vue 文件保存下自动格式化代码

- 在项目目录下创建`.vscode`文件夹，并创建`settings.json`文件

把下面这段 json 文件复制到`settings.json`文件中,当然这是以我个人项目为主的配置

```Plain
{
  "typescript.tsdk": "./node_modules/typescript/lib",
  "editor.tabSize": 2,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.eol": "\n",
  "npm.packageManager": "pnpm",
  "stylelint.packageManager": "pnpm",
  "search.exclude": {
    "**/node_modules": true,
    "**/*.log": true,
    "**/*.log*": true,
    "**/bower_components": true,
    "**/dist": true,
    "**/elehukouben": true,
    "**/.git": true,
    "**/.gitignore": true,
    "**/.svn": true,
    "**/.DS_Store": true,
    "**/.idea": true,
    "**/.vscode": false,
    "**/yarn.lock": true,
    "**/tmp": true,
    "out": true,
    "dist": true,
    "node_modules": true,
    "CHANGELOG.md": true,
    "examples": true,
    "res": true,
    "screenshots": true,
    "yarn-error.log": true,
    "**/.yarn": true
  },
  "files.exclude": {
    "**/.cache": true,
    "**/.editorconfig": true,
    "**/.eslintcache": true,
    "**/bower_components": true,
    "**/.idea": true,
    "**/tmp": true,
    "**/.git": true,
    "**/.svn": true,
    "**/.hg": true,
    "**/CVS": true,
    "**/.DS_Store": true
  },
  "files.watcherExclude": {
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/.vscode/**": true,
    "**/node_modules/**": true,
    "**/tmp/**": true,
    "**/bower_components/**": true,
    "**/dist/**": true,
    "**/yarn.lock": true
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[html]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[markdown]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "*.ts": "$(capture).test.ts, $(capture).test.tsx",
    "*.tsx": "$(capture).test.ts, $(capture).test.tsx",
    "*.env": "$(capture).env.*",
    "CHANGELOG.md": "CHANGELOG*",
    "package.json": "pnpm-lock.yaml,pnpm-workspace.yaml,LICENSE,.gitattributes,.gitignore,.gitpod.yml,CNAME,README*,.npmrc,.browserslistrc,.nvmrc",
    ".eslintrc.js": ".eslintignore,.prettierignore,.stylelintignore,.commitlintrc.js,.prettierrc.js,.stylelintrc.js,.lintstagedrc"
  },
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  // "[vue]": {
  //   "editor.codeActionsOnSave": {
  //     "source.fixAll.eslint": true
  //   }
  // },

  "editor.formatOnSave": true
}
```

> 以上是我个人的配置，如有多余或者缺少的自行添加
>
> 注意：如果发现复制这段 Json 在执行脚本时报"C:\Users\Admin\AppData\Roaming\npm\yarn.ps1,因为在此系统中禁止执行脚本"的错误
>
> 解决方法: 以管理员身份运行 vscode 并执行 set-ExecutionPolicy RemoteSigned

这里如果只是配置 ts, js 项目, 请加上这句代码,不然不会生效

```Plain
"typescript.format.enable": false,
"javascript.format.enable": false
```

## Mockjs 的使用

在@appf/vite 中我们已经对 mockjs 插件进行了集成，那么接下来只要按照插件的约定方式进行使用即可，如下示例：

![img](https://gitee.com/lzdjack-docs/assets/raw/master/893ad527-10ea-4c0c-9f22-e7f52a1b76c7.png)

![img](https://gitee.com/lzdjack-docs/assets/raw/master/1c1314ff-3921-4e5f-822e-2f95ce3fb567.png)

> 1. 根目录下创建 mock 文件夹
> 2. 按照图二的方式导出对应接口，按照约定，导出的接口 url 必须与图一 url 保持一致才会代理成功

## 安装 Unocss

在本项目中你可能会看到很多这样的样式书写（下图），其实这里使用了 css 原子化框架 unocss，本质上是一个工具集，包含了大量类似 flex、 pt-4、 text-center 以及 rotate-90 等工具类，可以组合使用并直接在 HTML 代码上实现任何 UI 设计。那么如何查看这些工具集呢，请查看 unocss 官网或者 tailwindcss 官网（unocss 集成了 tailwindcss，它的工具类同样适用）

![img](https://gitee.com/lzdjack-docs/assets/raw/master/cf94964f-eaf6-456b-ba3f-7aba95186036.png)

在上面介绍@cf/vite 中插件部分其实都已经包含其中

![img](https://gitee.com/lzdjack-docs/assets/raw/master/df7d0958-361f-4266-9260-538bf9c3e580.png)

但是想要 css 工具类生效，还需要在 mian.ts 中引入 uno.css 文件

![img](https://gitee.com/lzdjack-docs/assets/raw/master/fc37bf23-7abf-4bd1-91fb-a1b64e494b13.png)

## Css 框架的实践

此 css 框架是借鉴了开源项目 element-plus，实现了很多 css 工具类方便开发者使用，CSS 命名采用 BEM 的风格，阅读起来更加清晰明了

![img](https://gitee.com/lzdjack-docs/assets/raw/master/8f59c46c-785b-45d2-9208-b49f5c0b2a85.png)

> 上图为什么没有引用 scss 工具类就能使用呢？因为我们在 vitejs 中添加了全局共享 scss 属性，所以可以在任何.vue 文件中使用

![img](https://gitee.com/lzdjack-docs/assets/raw/master/d80a230d-6c88-4d70-b0f0-95fff8cce674.png)
