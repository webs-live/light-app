<script setup lang="ts">
  import { useNamespace } from '@app/hooks';

  import { VideoPlayer } from '@videojs-player/vue';

  defineOptions({
    name: 'basic-video',
  });

  interface Props {
    /**
     * 视频路径
     * @default ''
     */
    path: string;
    /**
     * 视频缩略图
     * @default ''
     */
    poster: string;
  }

  withDefaults(defineProps<Props>(), {
    path: '',
    poster: '',
  });

  const ns = useNamespace('basic-video');
</script>

<template>
  <VideoPlayer
    ref="videoRef"
    :class="ns.e('video')"
    :src="path"
    :poster="poster"
    playsinline
    controls
    :volume="0.6"
    :playback-rates="[0.7, 1.0, 1.5, 2.0]"
  />
</template>

<style lang="scss">
  .video-js .vjs-big-play-button {
    top: auto !important;
    left: auto !important;
  }
</style>
<style module lang="scss">
  @include b('basic-video') {
    @include e('video') {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
</style>
