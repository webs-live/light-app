import { BasicPullRefreshDom } from '@app/bs-ui';
import { useEventListener } from '@vueuse/core';
import { onMounted, ref } from 'vue';

let timer: any = null;

export function useTabbar(fn: () => BasicPullRefreshDom | Promise<BasicPullRefreshDom>) {
  const show = ref(true);

  onMounted(async () => {
    const dom = await fn();

    useEventListener(dom.pullRefreshDom, 'scroll', () => {
      show.value = false;

      timer && clearTimeout(timer);
      timer = setTimeout(() => {
        show.value = true;
      }, 500);
    });
  });

  return {
    show,
  };
}
