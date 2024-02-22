<script setup lang="ts">
  import { Card, Progress, Tag } from 'vant';
  import { Icon } from '@app/ui';
  import { usePermission } from '@app/service';

  interface Props {
    /**
     * 0: 缩影任务
     * 1：完成任务
     * @default 0
     */
    type: 0 | 1;
    dataList: Record<string, any>;
    title: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    type: 0,
    title: '',
    dataList: () => ({}),
  });

  const emit = defineEmits<{
    more: [args: any, type: number];
    click: [task: any];
  }>();

  const { hasPermission } = usePermission();

  const getTag = (states) => {
    let obj: Record<string, any> = {};
    switch (states) {
      case -1:
        obj = {
          text: '已失败',
          color: '#ee0a24',
          percentage: 0,
        };
        break;
      case 0:
        obj = {
          text: '等待中',
          color: 'gray',
          percentage: 0,
        };
        break;
      case 1:
        obj = {
          text: '处理中',
          color: '#1989fa',
          percentage: 100,
        };
        break;
      case 3:
        obj = {
          text: '已取消',
          color: '#ff976a',
          percentage: 0,
        };
        break;
    }

    return obj;
  };

  /**
   * 查看更多
   * @param task
   */
  function handleMore(task: Record<string, any>) {
    emit('more', task, props.type === 0 ? 0 : 1);
  }

  /**
   * 跳转视频页面
   * @param task
   */
  function handleClick(task: Record<string, any>) {
    props.type != 0 && emit('click', task);
  }
</script>
<template>
  <div class="p-2">
    <div class="py-2 font-bold text-base">{{ title }}</div>
    <Card
      v-for="(item, index) in dataList"
      :key="index"
      :desc="item.setting"
      :thumb="item.avatar"
      :title="`${item.title}`"
      @click="handleClick(item)"
    >
      <template v-if="type === 0" #tags>
        <Progress
          class="my-2"
          :color="getTag(item.states).color"
          :percentage="getTag(item.states).percentage"
          :show-pivot="false"
        />
      </template>
      <template v-if="type === 0" #tag>
        <Tag class="!rounded-r-full" :color="getTag(item.states).color">
          {{ getTag(item.states).text }}</Tag
        >
      </template>
      <template #bottom>
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <div>时长</div>
            <div class="ml-1">{{ item.duration }}</div>
            <div class="ml-2">|</div>
            <div class="ml-2">{{ item.size }}</div>
          </div>
          <div v-if="!hasPermission('0')" class="ml-2 flex" @click.stop="handleMore(item)">
            <Icon icon="ic:outline-more-horiz" size="18" color="gray"></Icon>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
