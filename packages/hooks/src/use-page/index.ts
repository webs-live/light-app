import type { RouteLocationRaw, Router } from 'vue-router';

import { useRouter } from 'vue-router';

export type PathAsPageEnum<T> = T extends { path: string } ? T & { path: string } : T;
export type RouteLocationRawEx = PathAsPageEnum<RouteLocationRaw>;

function handleError(e: Error) {
  console.error(e);
}

/**
 * page switch
 */
export function useGo(_router?: Router) {
  const { push, replace } = _router || useRouter();
  function go(opt: RouteLocationRawEx, isReplace = false) {
    if (!opt) {
      return;
    }
    isReplace ? replace(opt).catch(handleError) : push(opt).catch(handleError);
  }
  return go;
}

/**
 * back page
 * @param _router
 */
export function useBack(_router?: Router) {
  const { go } = _router || useRouter();

  return function (index: number = -1) {
    go(index);
  };
}
