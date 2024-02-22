import { Ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { computed } from 'vue';

export function useRefreshHeight(dom: {
  mainDom: Ref<HTMLElement>;
  topDom: Ref<HTMLElement>;
  bottomDom: Ref<HTMLElement>;
}) {
  const main = useElementSize(dom.mainDom);
  const bottom = useElementSize(dom.bottomDom);

  const top = useElementSize(dom.topDom);

  const heightRef = computed(() => {
    return main.height.value - top.height.value - bottom.height.value;
  });

  return {
    height: heightRef,
  };
}
