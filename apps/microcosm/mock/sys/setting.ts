import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

export default [
  {
    url: '/light-app/open-api/v1/setting/notify/enable',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess(true);
    },
  },
  {
    url: '/light-app/open-api/v1/setting/notify/enable',
    timeout: 1000,
    statusCode: 200,
    method: 'put',
    response: ({ body }) => {
      const enable = body?.enable ?? false;
      return resultSuccess(enable);
    },
  },
  {
    url: '/light-app/open-api/v1/setting/log/term',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess('7天');
    },
  },
  {
    url: '/light-app/open-api/v1/setting/log/term',
    timeout: 1000,
    statusCode: 200,
    method: 'put',
    response: ({ body }) => {
      return resultSuccess(body?.day);
    },
  },
  {
    url: '/light-app/open-api/v1/setting/storage',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess('家庭算力主机/时光缩影');
    },
  },
  {
    url: '/light-app/open-api/v1/setting/share',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess(true);
    },
  },
  {
    url: '/light-app/open-api/v1/setting/share',
    timeout: 1000,
    statusCode: 200,
    method: 'put',
    response: ({ body }) => {
      const enable = body?.enable ?? false;
      return resultSuccess(enable);
    },
  },
  {
    url: '/light-app/open-api/v1/configure',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess({
        week: '每日',
        startTime: '00时',
        endTime: '08时',
      });
    },
  },
  {
    url: '/light-app/open-api/v1/configure',
    timeout: 1000,
    statusCode: 200,
    method: 'put',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
] as MockMethod[];
