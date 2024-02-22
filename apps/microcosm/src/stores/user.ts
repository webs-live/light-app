import { ref } from 'vue';
import { defineStore } from 'pinia';
import { store } from '.';

export const useUserStore = defineStore('user', () => {
  const token = ref<string>();

  const setToken = (key: string) => {
    token.value = key;
  };

  const setInfo = (options: { token?: string }) => {
    options.token && setToken(options.token);
  };

  return { setToken, setInfo, token };
});

export function useUserStoreWithOut() {
  return useUserStore(store);
}
