<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Icon } from '@app/ui';
  import List from './list.vue';
  import { BackTop, Calendar } from 'vant';
  import { useWindowSize } from '@vueuse/core';
  import { computed, ref } from 'vue';
  import { formatToDate, dateUtil } from '@app/shared';
  import { onMounted } from 'vue';

  const emit = defineEmits<{
    current: [string];
  }>();

  const ns = useNamespace('day-list');

  const showCalendar = ref(false);
  const maxDate = ref();
  const minDate = ref();

  const { width } = useWindowSize();

  const getBackUpRight = computed(() => {
    return width.value - 45;
  });

  onMounted(() => {
    const date = dateUtil().format('YYYY-MM-DD').split('-');

    maxDate.value = new Date(Number(date[0]), Number(date[1]) - 1, Number(date[2]));
    minDate.value = new Date(2020, 1, 1);
  });

  function handleCurrent(day: string) {
    emit('current', day);
  }

  function handleOpen() {
    showCalendar.value = true;
  }

  function handleConfirm(day) {
    showCalendar.value = false;
    const time = formatToDate(day);

    emit('current', time);
  }
</script>
<template>
  <div :class="ns.b()">
    <div :class="ns.e('list')">
      <List @current="handleCurrent" />
    </div>
    <div :class="ns.e('day')">
      <div :class="ns.em('day', 'border')" @click="handleOpen">
        <Icon icon="ep:calendar" color="rgba(0, 0, 0, 0.5)" :size="18" />
      </div>
    </div>
  </div>
  <BackTop
    :class="ns.b('back-top')"
    :target="`.${ns.e('list')}`"
    :right="getBackUpRight"
    :bottom="70"
  >
    <Icon icon="material-symbols:vertical-align-top" :size="20" />
  </BackTop>
  <Calendar
    v-model:show="showCalendar"
    :max-date="maxDate"
    :min-date="minDate"
    @confirm="handleConfirm"
  >
  </Calendar>
</template>
<style module lang="scss">
  @include b(day-list-back-top) {
    width: 36px;
    height: 36px;
  }
  @include b(day-list) {
    width: 50px;
    height: 100%;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    background-color: white;
    display: flex;
    flex-direction: column;

    @include e(list) {
      flex: 1;
      overflow: auto;
      position: relative;
    }

    @include e(day) {
      padding: 4px;
      margin: 8px 0;

      @include m(border) {
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 50px;
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
</style>
