import { getAppEnvConfig } from '@/utils/env';
import { register as serviceRegister, useParams } from '@app/service';
import { register as httpRegister, isProdMode } from '@app/shared';
import { handleHttpError } from './error';

export function setupHttp() {
  const { VITE_GLOB_API_URL_PREFIX, VITE_GLOB_API_ENGINE_URL } = getAppEnvConfig();

  const { params } = useParams();

  // 这里是自己服务的处理方式
  httpRegister({
    urlPrefix: VITE_GLOB_API_URL_PREFIX,
    requestInterceptors: [
      (config) => {
        if (isProdMode()) {
          config.urlPrefix = `${config.urlPrefix}/${params?.appId}`;
        }

        return config;
      },
      (config) => {
        (config as Record<string, any>).headers.Authorization = params?.token;
        return config;
      },
    ],
    onError: handleHttpError,
  });

  // 第三方服务sdk
  serviceRegister(
    {
      urlPrefix: VITE_GLOB_API_URL_PREFIX,
      onError: handleHttpError,
    },
    {
      dev_url: VITE_GLOB_API_ENGINE_URL,
      pro_url: window.origin,
    },
  );
}
