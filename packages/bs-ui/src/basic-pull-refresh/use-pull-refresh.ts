import { nextTick, onUnmounted, ref, unref, watch } from 'vue';
import {
  BasicPullRefreshActionType,
  BasicPullRefreshDom,
  BasicPullRefreshProps,
  UseBasicPullRefreshReturnType,
} from './props';
import { Nullable } from '@app/types';

type Props = Partial<BasicPullRefreshProps>;

export function usePullRefresh(props?: Props): UseBasicPullRefreshReturnType {
  const pullRefreshRef = ref<Nullable<BasicPullRefreshActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getInstance() {
    const instance = unref(pullRefreshRef);
    if (!instance) {
      console.error(
        'The instance has not been obtained, please make sure has been rendered when performing  operation!',
      );
    }
    await nextTick();
    return instance;
  }

  function register(instance: BasicPullRefreshActionType) {
    onUnmounted(() => {
      pullRefreshRef.value = null;
      loadedRef.value = null;
    });
    if (unref(loadedRef) && instance === unref(pullRefreshRef)) return;

    pullRefreshRef.value = instance;
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(props);
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  const methods: BasicPullRefreshActionType = {
    setProps: async (props: Props) => {
      const instance = await getInstance();
      instance?.setProps(props);
    },
    reload: async () => {
      const instance = await getInstance();
      instance?.reload();
    },
    error: async (error?: string) => {
      const instance = await getInstance();
      instance?.error(error);
    },
    complete: async (data: any[]) => {
      const instance = await getInstance();
      instance?.complete(data);
    },
    getRef: async () => {
      const instance = await getInstance();

      return instance?.getRef() as Promise<BasicPullRefreshDom>;
    },
  };

  return [register, methods];
}
