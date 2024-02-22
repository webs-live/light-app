import { withInstall } from '@app/shared';
import basicPullRefresh from './index.vue';

const BasicPullRefresh = withInstall(basicPullRefresh);

export { BasicPullRefresh };

export default BasicPullRefresh;

export * from './use-pull-refresh';

export type { BasicPullRefreshDom, BasicPullRefreshActionType } from './props';
