<script setup lang="ts">
  import { findTaskListApi, findTaskSettingApi } from '@/api';
  import { NavBar } from '@/components';
  import { usePullRefresh, BasicPullRefresh } from '@app/bs-ui';
  import { onMounted, ref } from 'vue';
  import { ActionSheet, BackTop, FloatingBubble } from 'vant';
  import { useOperate } from './use-operate';
  import { useGo } from '@app/hooks';
  import TaskList from './task-list.vue';
  import { isEmpty } from 'lodash-es';
  import { usePermission } from '@app/service';

  defineOptions({
    name: 'custom',
  });

  const dataList = ref<any[]>([]);
  const taskList = ref<any[]>([]);

  const [register, methods] = usePullRefresh();
  const { model, handleMore } = useOperate({ ...methods, findTaskList });
  const go = useGo();
  const { hasPermission } = usePermission();

  onMounted(() => {
    findTaskList();
    findCustomSetting();
  });

  async function findCustomSetting() {
    try {
      const res = await findTaskSettingApi();
      if (isEmpty(res)) {
        handleGo();
      }
    } catch (error) {}
  }

  /**
   * 获取任务列表
   * @param
   */
  async function findTaskList() {
    try {
      taskList.value = await findTaskListApi();
    } catch (error) {}
  }

  /**
   * 获取任务任务完成的列表数据
   * @param page
   * @param pageSize
   */
  async function queryList(page, pageSize) {
    try {
      const list = await findTaskListApi({ state: 2, page, pageSize });

      methods.complete(list);
    } catch (error) {}
  }

  /**
   * 跳转视频页面
   * @param task
   */
  function handleClick(task: Record<string, any>) {
    go(`/video?id=${task.id}`);
  }

  /**
   * 跳转到任务配置
   * @param
   */
  function handleGo() {
    go('/task-setting');
  }
</script>

<template>
  <BasicPullRefresh @register="register" v-model="dataList" @query="queryList">
    <template #top>
      <NavBar :border="false" title="定制缩影" left-arrow> </NavBar>
    </template>
    <template v-if="taskList.length > 0" #empty>
      <TaskList class="h-full" :type="0" title="缩影任务" :dataList="taskList" @more="handleMore" />
    </template>

    <TaskList :type="0" title="缩影任务" :dataList="taskList" @more="handleMore" />

    <TaskList
      :type="1"
      title="任务完成"
      :dataList="dataList"
      @more="handleMore"
      @click="handleClick"
    />

    <BackTop :bottom="100" :right="30"></BackTop>
    <FloatingBubble v-if="!hasPermission('0')" icon="plus" @click="handleGo"></FloatingBubble>
  </BasicPullRefresh>

  <ActionSheet
    v-model:show="model.show"
    :actions="model.actions"
    cancel-text="取消"
    close-on-click-action
    @cancel="model.show = false"
    @select="model.show = false"
  >
  </ActionSheet>
</template>
