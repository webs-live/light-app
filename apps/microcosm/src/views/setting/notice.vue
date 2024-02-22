<script setup lang="ts">
  import { findSettingNotifyEnableApi, putSettingNotifyEnableApi } from '@/api';
  import { CellGroup, Switch, showLoadingToast, showToast } from 'vant';
  import { ref } from 'vue';
  import { BasicCell } from '@app/bs-ui';
  import { onMounted } from 'vue';
  import { usePermission } from '@app/service';

  const checked = ref(false);
  const defaultLoading = ref(false);

  const { hasPermission } = usePermission();

  onMounted(() => {
    initDefaults();
  });

  /**
   * 初始化值
   * @param
   */
  async function initDefaults() {
    defaultLoading.value = true;
    try {
      const enable = await findSettingNotifyEnableApi();
      checked.value = !!enable;
      defaultLoading.value = false;
    } catch (error) {}
  }

  /**
   * 修改消息通知的状态
   * @param check
   */
  async function handleMessage(check: boolean) {
    const loading = showLoadingToast({});
    try {
      await putSettingNotifyEnableApi(check);
    } catch (error) {
      checked.value = !check;
    } finally {
      loading.close();
    }
  }

  /**
   * 权限提示
   * @param
   */
  function handleClick() {
    if (hasPermission('0')) {
      showToast('您没有操作权限');
      return;
    }
  }
</script>
<template>
  <CellGroup inset>
    <template #title>
      <div class="text-black">时光缩影消息推送</div>
      <div class="text-sm text-gray-400 mt-1">生成全天时光缩影，推送消息通知</div>
    </template>
    <BasicCell :loading="defaultLoading" title="消息通知">
      <template #value>
        <div class="flex justify-end items-center h-full">
          <Switch
            v-model="checked"
            :disabled="hasPermission('0')"
            :size="18"
            @change="handleMessage"
            @click="handleClick"
          ></Switch>
        </div>
      </template>
    </BasicCell>
  </CellGroup>
</template>
