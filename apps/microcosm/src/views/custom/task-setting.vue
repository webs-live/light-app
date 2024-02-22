<script setup lang="ts">
  import { findDeviceListApi, findTaskSettingApi, putTaskSettingApi } from '@/api';
  import { useNamespace } from '@app/hooks';
  import {
    NoticeBar,
    showLoadingToast,
    CellGroup,
    Button,
    Popup,
    PickerGroup,
    DatePicker,
    TimePicker,
    showConfirmDialog,
    showToast,
    Empty,
  } from 'vant';
  import { onMounted, ref, watch } from 'vue';
  import { BasicCell } from '@app/bs-ui';
  import { Icon } from '@app/ui';
  import { useSelected } from './use-selected';
  import { usePicker } from './use-picker';
  import { isEmpty } from 'lodash-es';

  const ns = useNamespace('task-setting');
  const { keys, add, remove } = useSelected();
  const {
    model: pickModel,
    handleOpenStartDatePick,
    handleOpenEndDatePick,
    handlePicker,
    handlePickerConfirm,
  } = usePicker();

  const dataList = ref<any[]>([]);
  const defaultLoading = ref(false);
  const btnLoading = ref(false);
  const inited = ref(false);
  const hasEdit = ref(false);

  watch(
    () => inited.value,
    () => {
      if (inited.value) {
        watch(
          [() => keys.value, () => pickModel.startDate, () => pickModel.endDate],
          () => {
            hasEdit.value = true;
          },
          {
            deep: true,
          },
        );
      }
    },
  );

  onMounted(() => {
    initDefaults();
  });

  async function initDefaults() {
    defaultLoading.value = true;
    btnLoading.value = true;
    const loading = showLoadingToast({});
    try {
      await Promise.all([findTaskSetting(), findDeviceList()]);

      defaultLoading.value = false;
      btnLoading.value = false;
      inited.value = true;
    } catch (error) {
    } finally {
      loading.close();
    }
  }

  /**
   * 查看默认配置
   * @param
   */
  async function findTaskSetting() {
    try {
      const res = await findTaskSettingApi();
      pickModel.startDate = res.startTime;
      pickModel.endDate = res.endTime;
      keys.value = res.devices;
    } catch (error) {}
  }

  /**
   * 查询当前可用设备
   * @param
   */
  async function findDeviceList() {
    try {
      dataList.value = await findDeviceListApi();

      if (isEmpty(dataList.value)) {
        showToast('当前没有可用的缩影设备');
      }
    } catch (e) {}
  }

  /**
   * 点击选中
   * @param
   */
  function handleSelect(task: Record<string, any>) {
    add(task.id);
  }

  /**
   * 取消选中
   * @param task
   */
  function handleCancelSelected(task: Record<string, any>) {
    remove(task.id);
  }

  /**
   * 保存任务配置
   * @param
   */
  async function handleSave() {
    if (keys.value.length === 0) {
      showToast('请选择缩影设备');
      return;
    }
    if (!pickModel.endDate) {
      showToast('请选择结束时间');
      return;
    }
    const loading = showLoadingToast({});
    try {
      await putTaskSettingApi({
        devices: keys.value,
        startTime: pickModel.startDate,
        endTime: pickModel.endDate,
      });

      hasEdit.value = false;
      loading.close();
      showToast('任务配置成功');
    } catch (error) {
      loading.close();
      showToast('任务配置失败');
    }
  }

  /**
   * 拦截返回按钮
   * @param
   */
  async function beforeBack() {
    if (hasEdit.value) {
      try {
        await showConfirmDialog({
          message: '已修改任务配置，是否更新任务配置？',
        });
        await handleSave();
        return true;
      } catch (error) {
        return true;
      }
    }
  }
</script>

<template>
  <NavBar :border="false" title="创建任务" left-arrow :beforeBack="beforeBack"> </NavBar>
  <NoticeBar color="#1989fa" background="#ecf9ff" left-icon="info-o" :scrollable="false" wrapable>
    <div class="text-sm"
      >最多可创建一个任务，会在设备空闲时，为您生成缩影文件，任务完成后，可再次创建</div
    >
  </NoticeBar>
  <div class="px-4 pt-6 pb-2 text-black" :class="ns.e('font-size')">选择定制生成的缩影设备</div>
  <div v-if="dataList.length > 0" class="grid grid-cols-2 gap-2 my-2 mx-4">
    <div
      :class="[
        'rounded  relative bg-white',
        keys.includes(item.id) ? 'outline-1 outline-blue-500 outline outline-offset-0' : '',
      ]"
      v-for="(item, index) in dataList"
      :key="index"
      @click="handleSelect(item)"
    >
      <div class="flex py-4 px-2">
        <img class="h-10 w-10 mr-1" :src="item.avatar" />
        <div class="flex flex-col content-between">
          <div
            class="text-sm flex-1 text-ellipsis overflow-hidden truncate self-center"
            style="width: 28vw"
            >{{ item.title }}</div
          >
          <div class="flex items-center">
            <div
              :class="[
                ns.e('round'),
                'rounded-full',
                item.on_line ? 'bg-green-500' : 'bg-gray-500',
                'mr-1',
              ]"
            ></div>
            <span class="text-xs text-gray-500">{{ item.on_line ? '在线' : '离线' }}</span>
          </div>
        </div>
      </div>
      <Icon
        v-if="keys.includes(item.id)"
        :class="['absolute top-1 right-1 text-blue-500']"
        icon="ic:baseline-check-circle"
        size="18"
        @click.stop="handleCancelSelected(item)"
      />
    </div>
  </div>
  <Empty v-else />
  <CellGroup inset>
    <template #title>
      <div class="text-black">选择定制生成日期</div>
      <div class="text-sm text-gray-400 mt-1">定制的时间区间需在1小时到4小时</div>
    </template>
    <BasicCell
      :loading="defaultLoading"
      title="开始时间"
      :value="pickModel.startDate"
      is-link
      @click="handleOpenStartDatePick"
    >
    </BasicCell>
    <BasicCell
      :loading="defaultLoading"
      title="结束时间"
      :value="pickModel.endDate"
      is-link
      @click="handleOpenEndDatePick"
    >
    </BasicCell>
  </CellGroup>
  <div class="fixed left-5 right-5 bottom-5">
    <Button
      type="primary"
      :loading="btnLoading"
      loading-type="spinner"
      round
      block
      @click="handleSave"
      >保存配置</Button
    >
  </div>

  <Popup v-model:show="pickModel.show" round position="bottom">
    <PickerGroup
      :title="pickModel.title"
      :tabs="['选择日期', '选择时间']"
      next-step-text="下一步"
      @confirm="handlePickerConfirm"
      @cancel="pickModel.show = false"
    >
      <DatePicker
        v-model="pickModel.currentDate"
        :max-date="pickModel.maxDate"
        :min-date="pickModel.minDate"
        @change="handlePicker"
      />
      <TimePicker
        v-model="pickModel.currentTime"
        :columns-type="['hour']"
        :min-hour="pickModel.minTime"
        :max-hour="pickModel.maxTime"
      />
    </PickerGroup>
  </Popup>
</template>
<style module lang="scss">
  @include b(task-setting) {
    @include e(round) {
      height: 5px;
      width: 5px;
    }

    @include e(font-size) {
      font-size: var(--van-cell-group-title-font-size);
      line-height: var(--van-cell-group-title-line-height);
    }
  }
</style>
