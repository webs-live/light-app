<script setup lang="ts">
  import { findVideoApi } from '@/api';
  import { BasicVideo } from '@app/bs-ui';
  import { showLoadingToast } from 'vant';
  import { onMounted, reactive } from 'vue';
  import { useRoute } from 'vue-router';
  import { NavBar } from '@/components';

  const { query } = useRoute();

  const id = query.id as string;

  const model = reactive({
    path: '',
    cover: '',
  });

  onMounted(() => {
    initDefaults();
  });
  async function initDefaults() {
    const loading = showLoadingToast({});
    try {
      const res = await findVideoApi(id);
      model.cover = res.cover;
      model.path = res.path;
    } catch (error) {
    } finally {
      loading.close();
    }
  }
</script>

<template>
  <div class="flex flex-col h-full">
    <NavBar bgColor="transparent" fixed :border="false" theme="dark" left-arrow> </NavBar>
    <BasicVideo :path="model.path" :poster="model.cover"></BasicVideo>
  </div>
</template>
