import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

export default [
  {
    url: '/light-app/open-api/v1/storage',
    timeout: 1000,
    statusCode: 200,
    method: 'get',
    response: () => {
      return resultSuccess('{"agreement":false}');
    },
  },
  {
    url: '/light-app/open-api/v1/storage',
    timeout: 1000,
    statusCode: 200,
    method: 'post',
    response: ({ body }) => {
      return resultSuccess(body);
    },
  },
] as MockMethod[];
