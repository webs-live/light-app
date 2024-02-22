import { buildProps, definePropType } from '@app/shared';
import { ExtractPropTypes, Ref } from 'vue';
import { DEFAULT_EMPTY_DESC, DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_ERROR_DESC } from './const';
import { EmptyProps } from 'vant';
import { Nullable } from '@app/types';

interface Pager {
  page: number;
  pageSize: number;
}

export const basicPullRefreshProps = buildProps({
  modelValue: {
    type: Array,
    default: [],
  },
  offset: {
    type: definePropType<number | string>(Array<String | Number>),
  },
  loadingText: {
    type: String,
  },
  finishedText: {
    type: String,
  },
  errortext: {
    type: String,
  },
  pullingText: {
    type: String,
  },
  pullLoosingText: {
    type: String,
  },
  pullLoadingText: {
    type: String,
  },
  pullSuccessText: {
    type: String,
  },
  pager: {
    type: definePropType<Pager>(Object),
    default: () => ({
      page: DEFAULT_PAGE,
      pageSize: DEFAULT_PAGE_SIZE,
    }),
  },
  empty: {
    type: definePropType<EmptyProps>(Object),
    default: () => ({
      description: DEFAULT_EMPTY_DESC,
    }),
  },
  error: {
    type: definePropType<EmptyProps>(Object),
    default: () => ({
      description: DEFAULT_ERROR_DESC,
      image: 'error',
    }),
  },
  immediate: {
    type: Boolean,
    default: true,
  },
  loadingMoreEnabled: {
    type: Boolean,
    default: true,
  },
  refresherEnabled: {
    type: Boolean,
    default: true,
  },
});

export type BasicPullRefreshProps = ExtractPropTypes<typeof basicPullRefreshProps>;

export interface BasicPullRefreshDom {
  pullRefreshDom: Ref<Nullable<HTMLElement>>;
}

export interface BasicPullRefreshActionType {
  setProps: (props: Partial<BasicPullRefreshProps>) => void;
  complete: (data: any[]) => void;
  reload: () => void;
  error: (error?: string) => void;
  getRef: () => BasicPullRefreshDom | Promise<BasicPullRefreshDom>;
}

export type RegisterFn = (instance: BasicPullRefreshActionType) => void;

export type UseBasicPullRefreshReturnType = [RegisterFn, BasicPullRefreshActionType];
