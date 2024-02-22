<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Card } from 'vant';
  import { computed } from 'vue';
  const ns = useNamespace('card-item');

  interface Props {
    /**
     * 视频单个数据源
     * @default {}
     */
    video: any;
    /**
     * 选中的card
     * @default ''
     */
    isAvtive: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    video: () => ({}),
    isAvtive: false,
  });

  const emit = defineEmits<{
    click: [id: string];
  }>();

  function handleClick() {
    emit('click', props.video);
  }

  const getActive = computed(() => {
    return {
      [ns.b()]: true,
      [ns.is('active')]: props.isAvtive,
    };
  });
</script>
<template>
  <Card
    :class="getActive"
    :thumb="video.avatar"
    :title="`${video.title}`"
    :tag="isAvtive ? '播放中' : ''"
    @click="handleClick"
  >
    <template #bottom>
      <div class="flex items-center">
        <div>时长</div>
        <div class="ml-1">{{ video.duration }}</div>
        <div class="ml-2">|</div>
        <div class="ml-2">{{ video.size }}</div>
      </div>
    </template>
  </Card>
</template>
<style lang="scss" module>
  @include b(card-item) {
    border-radius: 4px;

    @include when(active) {
      border: 1px solid var(--van-primary-color) !important;
      box-sizing: border-box;
    }
  }
</style>
