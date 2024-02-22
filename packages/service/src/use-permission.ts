import { intersection, isArray } from 'lodash-es';
import { useParams } from './use-params';

export function usePermission() {
  const { params } = useParams();

  function hasPermission(value?: string | string[], def = true) {
    if (!value) {
      return def;
    }

    const rouls = isArray(params?.roles) ? params?.roles : [params?.roles];

    if (!isArray(value)) {
      return rouls!.includes(value);
    }
    return intersection(value, rouls).length > 0;
  }

  return { hasPermission };
}
