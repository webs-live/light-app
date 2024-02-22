<script setup lang="ts">
  import { NavBar } from '@/components';
  import {
    CellGroup,
    Popup,
    Picker,
    Button,
    showLoadingToast,
    showToast,
    showConfirmDialog,
  } from 'vant';
  import { BasicCell } from '@app/bs-ui';
  import { reactive, ref, onMounted, watch } from 'vue';
  import { getColumns } from './utils';
  import { findConfigureApi, putConfigureApi } from '@/api';
  import { usePermission } from '@app/service';

  defineOptions({
    name: 'configure',
  });

  const { hasPermission } = usePermission();

  const inited = ref(false);
  const hasEdit = ref(false);
  const defaultLoading = ref(false);
  const btnLoading = ref(false);
  // 缩影周期
  const cycle = reactive({
    show: false,
    selects: ['每日'],
    columns: [
      { text: '每日', value: '每日' },
      { text: '周一', value: '周一' },
      { text: '周二', value: '周二' },
      { text: '周三', value: '周三' },
      { text: '周四', value: '周四' },
      { text: '周五', value: '周四' },
      { text: '周六', value: '周六' },
      { text: '周日', value: '周日' },
    ],
    value: '周三',
  });

  // 缩影时间
  const time = reactive({
    show: false,
    selects: ['00时', '24时'],
    columns: getColumns(22, 2, 8),
    startTime: '00时',
    endTime: '24时',
  });

  watch(
    () => inited.value,
    () => {
      if (inited.value) {
        watch([() => time.startTime, () => time.endTime, () => cycle.value], () => {
          hasEdit.value = true;
        });
      }
    },
  );

  onMounted(() => {
    initDefaults();
  });

  /**
   * 设置默认值
   * @param
   */
  async function initDefaults() {
    defaultLoading.value = true;
    btnLoading.value = true;

    try {
      const res = await findConfigureApi();
      cycle.value = res.week;
      cycle.selects = [res.week];
      time.startTime = res.startTime;
      time.endTime = res.endTime;
      time.selects = [res.startTime, res.endTime];
      defaultLoading.value = false;
      btnLoading.value = false;
      inited.value = true;
    } catch (error) {}
  }

  /**
   * 设置周期
   * @param { selectedOptions }
   */
  function handleWeek({ selectedOptions }) {
    cycle.show = false;
    cycle.value = selectedOptions[0].value;
  }

  /**
   * 设置时间
   * @param { selectedOptions }
   */
  function handleTime({ selectedOptions }) {
    time.show = false;
    time.startTime = selectedOptions[0].value;
    time.endTime = selectedOptions[1].value;
  }

  /**
   * 打开周期选择框
   * @param
   */
  function handleOpenWeek() {
    if (hasPermission('0')) {
      showToast('您没有操作权限');
      return;
    }

    cycle.show = true;
  }

  /**
   * 打开时间选择框
   * @param
   */
  function handleOpenTime() {
    if (hasPermission('0')) {
      showToast('您没有操作权限');
      return;
    }

    time.show = true;
  }

  /**
   * 保存配置
   * @param
   */
  async function handleSave() {
    showLoadingToast('保存中');
    btnLoading.value = true;
    try {
      await putConfigureApi({
        week: cycle.value,
        startTime: time.startTime,
        endTime: time.endTime,
      });

      hasEdit.value = false;
      showToast('保存成功');
    } catch (error) {
      showToast('保存失败');
    } finally {
      btnLoading.value = false;
    }
  }

  /**
   * 拦截退出，退出前询问是否保存配置
   * @param
   */
  async function beforeBack() {
    if (hasEdit.value) {
      try {
        await showConfirmDialog({
          message: '已修改缩影时间范围，是否更新缩影时间段？',
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
  <NavBar :border="false" title="缩影配置" left-arrow :beforeBack="beforeBack"> </NavBar>
  <CellGroup inset>
    <template #title>
      <div class="text-black">设置每天缩影时间段</div>
      <div class="text-sm text-gray-400 mt-1"
        >开启摄像头全天视频记录，设置时间段后，通过摄像头每日回看记录在次日自动生成缩影视频</div
      >
    </template>
    <BasicCell
      :loading="defaultLoading"
      title="缩影周期"
      :value="`每周 ${cycle.value}`"
      is-link
      @click="handleOpenWeek"
    >
    </BasicCell>
    <BasicCell
      :loading="defaultLoading"
      title="缩影时间"
      :value="`${time.startTime} - ${time.endTime}`"
      is-link
      @click="handleOpenTime"
    >
    </BasicCell>
  </CellGroup>
  <div v-if="!hasPermission('0')" class="fixed left-5 right-5 bottom-5">
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
  <Popup v-model:show="cycle.show" round position="bottom">
    <Picker
      v-model="cycle.selects"
      title="缩影周期"
      :columns="cycle.columns"
      @cancel="cycle.show = false"
      @confirm="handleWeek"
    />
  </Popup>
  <Popup v-model:show="time.show" round position="bottom">
    <Picker
      v-model="time.selects"
      title="缩影时间"
      :columns="time.columns"
      @cancel="time.show = false"
      @confirm="handleTime"
    />
  </Popup>
</template>
