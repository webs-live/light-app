import { ref } from 'vue';
import { remove as removeEs } from 'lodash-es';

export function useSelected() {
  const keys = ref<string[]>([]);

  function add(key: string) {
    if (keys.value.includes(key)) return;

    keys.value.push(key);
  }

  function remove(key: string) {
    removeEs(keys.value, (item) => item === key);
  }

  return {
    keys,
    add,
    remove,
  };
}
