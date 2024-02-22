import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';
// import { Random } from 'mockjs';

const getDevice = () => {
  return {
    id: '@guid',
    avatar:
      'https://img0.baidu.com/it/u=3656840582,3843313318&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    title: '@title()',
    'on_line|1': [true, false],
  };
};

const getDeviceList = () => {
  const arr: any[] = [];

  for (let index = 0; index < 6; index++) {
    arr.push(getDevice());
  }

  return arr;
};

export default [
  {
    url: '/light-app/open-api/v1/device',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      const videos = getDeviceList();

      return resultSuccess(videos);
    },
  },
  {
    url: '/light-app/open-api/v1/enable',
    timeout: 1000,
    statusCode: 200,
    method: 'put',
    response: ({ body }) => {
      const enable = body?.enable ?? false;
      return resultSuccess(enable);
    },
  },
] as MockMethod[];
