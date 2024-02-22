import { Persistent } from '@app/shared';
import { ENGINE_KEY } from './enum';
import { IPublicParams } from './types';

let overrides: IPublicParams;

let inited = false;

export function useParams() {
  let params = Persistent.getLocal<IPublicParams>(ENGINE_KEY);
  if (!params?.token && inited) {
    if (overrides && Object.values(overrides).length > 0) {
      params = overrides;
    } else {
      console.error('当前环境下没有token，请设置默认params');
    }
  }

  const setParams = (args: IPublicParams) => {
    overrides = args;

    inited = true;
  };

  return {
    setParams,
    params,
  };
}
