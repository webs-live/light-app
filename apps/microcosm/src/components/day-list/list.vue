<script setup lang="ts">
  import { List, Loading } from 'vant';
  import { reactive, computed, onMounted, ref } from 'vue';
  import { dateUtil, formatToDate } from '@app/shared';
  import ListItem from './list-item.vue';

  const emit = defineEmits<{
    current: [string];
  }>();

  const model = reactive({
    finished: false,
    loading: false,
  });

  const page = ref(1);

  const list = ref<any[]>([]);

  async function handleLoad() {
    page.value++;

    model.loading = true;

    setTimeout(() => {
      loadDate();
      model.loading = false;
    }, 1000);
  }

  function iterateeFun(day, num, fn: (time: string) => void) {
    for (let index = num; index >= 1; index--) {
      const yearAndMonth = dateUtil(day).format('YYYY-MM');

      const timeStr = `${yearAndMonth}-${index}`;
      const time = formatToDate(timeStr);

      fn && fn(time);
    }
  }

  function init() {
    // 获取本月已过去了多少天
    const day = dateUtil().format('D');
    iterateeFun(dateUtil(), day, (time) => {
      list.value.push(time);
    });

    loadDate();
  }

  function loadDate() {
    const beforeMonth = dateUtil().subtract(page.value, 'month').format('YYYY-MM');
    const monthDay = dateUtil(beforeMonth).daysInMonth();
    iterateeFun(beforeMonth, monthDay, (time) => {
      list.value.push(time);
    });
  }

  const getList = computed(() => {
    const yearAndMonth = list.value.map((item) => {
      return dateUtil(item).format('YYYY-MM');
    });

    let arr: any[] = [];

    const setMap = new Set(yearAndMonth);
    for (const iterator of setMap) {
      let obj = { key: iterator, value: [] as any[] };
      const days: any[] = [];
      list.value.forEach((item) => {
        const day = dateUtil(item).format('YYYY-MM');

        if (day == iterator) {
          days.push(item);
        }
      });

      obj.value = days;
      arr.push(obj);
    }

    return arr;
  });

  onMounted(() => {
    init();
  });

  function handleCurrent(day: string) {
    emit('current', day);
  }
</script>

<template>
  <List
    v-model:loading="model.loading"
    :finished="model.finished"
    :offset="50"
    :immediate-check="false"
    @load="handleLoad"
  >
    <template #loading>
      <Loading :size="20" type="spinner" />
    </template>
    <ListItem
      v-for="(item, index) in getList"
      :key="index"
      :item="item"
      @current="handleCurrent"
    ></ListItem>
  </List>
</template>
