<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Grid, GridItem, Switch, showLoadingToast, showToast } from 'vant';
  import { BasicPullRefresh, usePullRefresh } from '@app/bs-ui';
  import { ref } from 'vue';
  import { findDeviceListApi, putDeviceEnableApi } from '@/api';
  import { NavBar } from '@/components';
  import { usePermission } from '@app/service';

  const ns = useNamespace('device');

  const [register, { complete, error, reload }] = usePullRefresh();
  const { hasPermission } = usePermission();

  const dataList = ref<any[]>([]);

  async function queryList() {
    try {
      const res = await findDeviceListApi();
      complete(res);
    } catch (e) {
      error();
    }
  }

  /**
   * 修改设备的状态
   * @param value
   */
  async function handleChange(value: boolean) {
    const loading = showLoadingToast({});
    try {
      await putDeviceEnableApi(value);
      value ? showToast('设备已开启检测') : showToast('设备已关闭检测');
      loading.close();
    } catch (error) {
      loading.close();
      reload();
    } finally {
    }
  }

  /**
   * 操作权限提醒
   * @param
   */
  function handleClickSwitch() {
    if (hasPermission('0')) {
      showToast('您没有操作权限');
    }
  }
</script>
<template>
  <div :class="ns.b()">
    <BasicPullRefresh
      @register="register"
      v-model="dataList"
      :loadingMoreEnabled="false"
      @query="queryList"
    >
      <template #top>
        <NavBar :border="false" title="我的设备" left-arrow> </NavBar>
      </template>
      <div class="mx-2 pt-4">
        <div class="text-black font-bold">温馨提示</div>
        <div class="mt-2 text-gray-500 text-sm tracking-wide"
          >时光缩影从摄像头24小时视频记录中，识别并剪辑出目标人物或宠物的缩影视频，于次日自动生成剪辑视频，请确保设备已开启全天录制视频</div
        >
      </div>
      <Grid class="my-2" :column-num="2" :gutter="8">
        <GridItem class="rounded" v-for="(item, index) in dataList" :key="index">
          <div class="flex">
            <img class="h-10 w-10 mr-1" :src="item.avatar" />
            <div
              class="text-sm flex-1 text-ellipsis overflow-hidden truncate self-center"
              style="width: 30vw"
              >{{ item.title }}</div
            >
          </div>
          <div class="flex w-full mt-4 justify-between items-center">
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
            <Switch
              :size="14"
              :disabled="hasPermission('0')"
              v-model="item.on_line"
              @change="handleChange"
              @click="handleClickSwitch"
            ></Switch>
          </div>
        </GridItem>
      </Grid>
    </BasicPullRefresh>
  </div>
</template>
<style module lang="scss">
  @include b(device) {
    @include e(round) {
      height: 5px;
      width: 5px;
    }
  }
</style>
