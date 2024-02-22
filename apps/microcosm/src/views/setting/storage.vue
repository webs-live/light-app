<script setup lang="ts">
  import { CellGroup } from 'vant';
  import { onMounted, ref } from 'vue';
  import { BasicCell } from '@app/bs-ui';
  import { findSettingStoragePathApi } from '@/api';

  const defaultLoading = ref(false);
  const path = ref('');

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
      const url = await findSettingStoragePathApi();
      path.value = url;
      defaultLoading.value = false;
    } catch (error) {}
  }
</script>

<template>
  <CellGroup inset>
    <template #title>
      <div class="text-black">储存路径</div>
      <div class="text-sm text-gray-400 mt-1">对应储存家庭算力主机的设备路径</div>
    </template>
    <BasicCell :loading="defaultLoading" :title="path"> </BasicCell>
  </CellGroup>
</template>
