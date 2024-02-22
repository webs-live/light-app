<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { BasicVideo } from '@app/bs-ui';

  const ns = useNamespace('video');

  interface Props {
    /**
     * 视频路径
     * @default ''
     */
    url: string;
    /**
     * 封面图
     * @default ''
     */
    cover: string;
  }

  withDefaults(defineProps<Props>(), {});
</script>

<template>
  <div :class="ns.b()">
    <BasicVideo :path="url" :poster="cover"></BasicVideo>
  </div>
</template>

<style module lang="scss">
  @include b(video) {
    height: 300px;
  }
</style>
