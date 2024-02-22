import { isDevMode } from '@app/shared';
import { useParams } from '@app/service';
import { getAppEnvConfig } from './utils/env';
import VConsole from 'vconsole';

const {
  VITE_ENGINE_USER_ID,
  VITE_ENGINE_TOKEN,
  VITE_ENGINE_APP_ID,
  VITE_ENGINE_DEVICE_ID,
  VITE_ENGINE_ROLES,
  VITE_GLOB_VCONSOLE,
} = getAppEnvConfig();

function settingEnvEngineParams() {
  const { setParams } = useParams();

  if (isDevMode()) {
    const roles = JSON.parse(VITE_ENGINE_ROLES);

    setParams({
      userId: VITE_ENGINE_USER_ID,
      token: VITE_ENGINE_TOKEN,
      appId: VITE_ENGINE_APP_ID,
      deviceId: VITE_ENGINE_DEVICE_ID,
      roles: roles,
    });
  }
}

function settingDevTools() {
  VITE_GLOB_VCONSOLE == 'true' && new VConsole();
}

export function initAppConfig() {
  // 设置打包后的开发者检查工具
  settingDevTools();
  // 在开发环境下设置轻应用引擎传递的必要参数
  // *这里必须注意执行顺序，开发模式要优先配置默认参数
  settingEnvEngineParams();
}
