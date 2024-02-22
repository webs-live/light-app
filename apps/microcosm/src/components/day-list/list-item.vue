<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { ref } from 'vue';
  import { dateUtil } from '@app/shared';
  import { Sticky } from 'vant';
  import { onMounted } from 'vue';

  const ns = useNamespace('item');

  interface Props {
    item: any;
  }

  withDefaults(defineProps<Props>(), {
    item: () => ({}),
  });

  const emit = defineEmits<{
    current: [string];
  }>();

  const dom = ref();

  const current = ref();

  onMounted(() => {
    current.value = dateUtil().format('YYYY-MM-DD');
  });

  function handleClick(day) {
    current.value = day;
    emit('current', day);
  }
</script>

<template>
  <div ref="dom" class="container" :class="ns.b()">
    <Sticky style="width: 100%" :container="dom" :offset-top="300">
      <div :class="ns.e('block')">{{ dateUtil(item.key).format('YYYY.MM') }}</div>
    </Sticky>

    <div
      :class="ns.e('round')"
      :style="{
        backgroundColor: day === current ? 'var(--van-primary-color)' : 'white',
        color: day === current ? 'white' : 'rgba(0, 0, 0, 0.6)',
      }"
      v-for="day in item.value"
      :key="day"
      @click="handleClick(day)"
    >
      {{ dateUtil(day).format('DD') }}
    </div>
  </div>
</template>

<style module lang="scss">
  @include b(item) {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    @include e(block) {
      font-size: 12px;
      zoom: 0.8;
      color: rgba(0, 0, 0, 0.8);
      padding: 4px 0;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: white;
    }

    @include e(round) {
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      height: 40px;
      width: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.6);
      margin: 4px 0;
    }
  }
</style>
