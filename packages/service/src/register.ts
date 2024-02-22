import { VAxios, Persistent, IHttpContext, ContentTypeEnum } from '@app/shared';
import { ENGINE_KEY } from './enum';
import { useParams } from './use-params';
import { merge } from 'lodash-es';
import { IPubliceEnv } from './types';

(() => {
  const searchPrams = location.hash.slice(location.hash.indexOf('?'));
  const queryParams = Object.fromEntries(new URLSearchParams(searchPrams));
  Persistent.setLocal(ENGINE_KEY, queryParams);
})();

export let context: IHttpContext = {
  // 自定义后端返回的字段
  resultField: {
    code: 'code',
    message: 'message',
    data: 'data',
  },
  // 后端返回数据格式，请求成功的依据
  successCode: 0,
  // 响应的过期时间
  timeout: 10 * 1000,
  // 基础接口地址
  headers: { 'Content-Type': ContentTypeEnum.JSON },
  // 默认将prefix 添加到url
  joinPrefix: true,
  // 是否返回原生响应头 比如：需要获取响应头时使用该属性
  isReturnNativeResponse: false,
  // 需要对返回数据进行处理
  isTransformResponse: true,
  // post请求的时候添加参数到url
  joinParamsToUrl: false,
  // 格式化提交参数时间
  formatDate: true,
  // 接口地址
  apiUrl: '',
  // 接口拼接地址
  urlPrefix: '',
  //  是否加入时间戳
  joinTime: true,
  // 忽略重复请求
  ignoreCancelToken: true,
  // 是否携带token
  withToken: true,
};

export let engineHttp: VAxios;
export let engineEnv: IPubliceEnv;

export function register(options: IHttpContext, env: IPubliceEnv) {
  engineEnv = env;
  context = merge(context, options);

  const { params } = useParams();

  // 第三方提供的方法：算力主机、原生
  engineHttp = new VAxios({
    requestInterceptors: [
      (config) => {
        (config as Record<string, any>).headers.Authorization = params?.token;
        return config;
      },
    ],
    ...context,
  });

  return engineHttp;
}
