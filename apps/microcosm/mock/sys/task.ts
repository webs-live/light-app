import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess, resultSuccess } from '../_util';
// import { Random } from 'mockjs';

const getTask = () => {
  return {
    id: '@guid',
    avatar: 'http://vjs.zencdn.net/v/oceans.png',
    title: '@title()',
    'states|1': [-1, 0, 1, 2, 3],
    setting: '2012-01-01 11:00-2012-01-01 11:00',
    duration: '@integer(100, 1000)',
    size: '@integer(100, 1000)',
    create_time: '@date("yyyy-MM-dd")',
    cover: 'http://vjs.zencdn.net/v/oceans.png',
    'file|1': [
      'http://vjs.zencdn.net/v/oceans.mp4',
      'https://icon.qiantucdn.com/images/assets/2023-02/1e8da821-1e09-3875-8085-856f3d248005.mp4',
      'https://icon.qiantucdn.com/images/assets/2023-03640058e1f1ee1_84.mp4',
    ],
  };
};

const getTaskList = () => {
  const arr: any[] = [];

  for (let index = 0; index < 100; index++) {
    arr.push(getTask());
  }

  return arr;
};

export default [
  {
    url: '/light-app/open-api/v1/tasks',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      const tasks = getTaskList();

      return resultPageSuccess(page, pageSize, tasks);
    },
  },
  {
    url: '/light-app/open-api/v1/task',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess(getTask());
    },
  },
  {
    url: '/light-app/open-api/v1/task',
    timeout: 1000,
    statusCode: 200,
    method: 'delete',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
  {
    url: '/light-app/open-api/v1/task/cancel',
    timeout: 1000,
    statusCode: 200,
    method: 'post',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
  {
    url: '/light-app/open-api/v1/task/rest',
    timeout: 1000,
    statusCode: 200,
    method: 'post',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
  {
    url: '/light-app/open-api/v1/task/setting',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess({
        startTime: '2020-10-10 10:00',
        endTime: '2020-10-10 12:00',
        devices: ['123'],
      });
    },
  },
  {
    url: '/light-app/open-api/v1/task/setting',
    timeout: 1000,
    statusCode: 200,
    method: 'post',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
] as MockMethod[];
