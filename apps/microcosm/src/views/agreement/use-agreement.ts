import { findStorageApi, putStorageApi } from '@/api';
import { exitLightApp } from '@app/service';
import { get } from 'lodash-es';
import { onMounted, ref } from 'vue';
import { useGo } from '@app/hooks';

export function useAgreement() {
  const showAgreement = ref(false);

  const go = useGo();

  onMounted(() => {
    initDefaults();
  });

  /**
   * 初始化默认数据
   * @param
   */
  async function initDefaults() {
    try {
      const res = await findStorageApi();

      if (!!get(res, 'agreement')) {
        showAgreement.value = false;
      } else {
        showAgreement.value = true;
      }
    } catch (error) {}
  }
  /**
   * 接受用户协议的操作
   * @param
   */
  async function handleConfirm() {
    try {
      const res = await findStorageApi();

      const storage = res ? JSON.parse(res) : {};

      await putStorageApi({
        ...storage,
        agreement: true,
      });

      showAgreement.value = true;
    } catch (error) {}
  }

  /**
   * 打开用户协议
   * @param
   */
  function handleOpenUser() {}

  /**
   * 打开隐私协议
   * @param
   */
  function handleOpenPrivacy() {}

  /**
   * 协议退出
   * @param
   */
  function handleCancel() {
    exitLightApp();
  }

  return {
    handleCancel,
    handleOpenPrivacy,
    handleOpenUser,
    handleConfirm,
    showAgreement,
  };
}
