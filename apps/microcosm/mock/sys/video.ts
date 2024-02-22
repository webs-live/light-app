import { MockMethod } from 'vite-plugin-mock';
import { resultPageSuccess, resultSuccess } from '../_util';
// import { Random } from 'mockjs';

const getVideo = () => {
  return {
    id: '@guid',
    avatar: 'http://vjs.zencdn.net/v/oceans.png',
    title: '@title()',
    size: '@integer(1000, 2000)',
    duration: '@integer(100, 1000)',
    create_time: '@date("yyyy-MM-dd")',
    cover: 'http://vjs.zencdn.net/v/oceans.png',
    'file|1': [
      'http://vjs.zencdn.net/v/oceans.mp4',
      'https://icon.qiantucdn.com/images/assets/2023-02/1e8da821-1e09-3875-8085-856f3d248005.mp4',
      'https://icon.qiantucdn.com/images/assets/2023-03640058e1f1ee1_84.mp4',
    ],
  };
};

const getVideoList = () => {
  const arr: any[] = [];

  for (let index = 0; index < 100; index++) {
    arr.push(getVideo());
  }

  return arr;
};

export default [
  {
    url: '/light-app/open-api/v1/videos',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: ({ query }) => {
      const { page = 1, pageSize = 20 } = query;
      const videos = getVideoList();

      return resultPageSuccess(page, pageSize, videos);
    },
  },
  {
    url: '/light-app/open-api/v1/video',
    timeout: 1000,
    statusCode: 200,
    method: 'delete',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
  {
    url: '/light-app/open-api/v1/video',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess(getVideo());
    },
  },
  {
    url: '/light-app/open-api/v1/video/download',
    timeout: 1000,
    statusCode: 200,
    method: 'post',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
] as MockMethod[];
