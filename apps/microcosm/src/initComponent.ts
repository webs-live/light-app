import { setToastDefaultOptions } from 'vant';

export function initComponent() {
  // 设置toast参数
  setToastDefaultOptions({ duration: 2000, forbidClick: true });
  setToastDefaultOptions('loading', { forbidClick: true, duration: 0 });
}
