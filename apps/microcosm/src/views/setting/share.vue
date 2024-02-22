<script setup lang="ts">
  import { findSettingShareEnableApi, putSettingShareEnableApi } from '@/api';
  import { CellGroup, Switch, showLoadingToast, showToast } from 'vant';
  import { onMounted, ref } from 'vue';
  import { BasicCell } from '@app/bs-ui';
  import { usePermission } from '@app/service';

  const defaultLoading = ref(false);
  const checked = ref(false);

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
      const res = await findSettingShareEnableApi();
      checked.value = res;
      defaultLoading.value = false;
    } catch (error) {}
  }

  /**
   * 修改文件共享状态
   * @param check
   */
  async function handleShare(check: boolean) {
    const loading = showLoadingToast({});
    try {
      await putSettingShareEnableApi(check);
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
      <div class="text-black">文件共享</div>
      <div class="text-sm text-gray-400 mt-1"
        >将家庭算力主机时光缩影文件夹共享至家庭空间，群成员可查看事件记录</div
      >
    </template>
    <BasicCell :loading="defaultLoading" title="共享至家庭空间">
      <template #value>
        <div class="flex justify-end items-center h-full">
          <Switch
            v-model="checked"
            :disabled="hasPermission('0')"
            :size="18"
            @change="handleShare"
            @click="handleClick"
          ></Switch>
        </div>
      </template>
    </BasicCell>
  </CellGroup>
</template>
