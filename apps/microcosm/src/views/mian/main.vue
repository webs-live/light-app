<script setup lang="ts">
  import { useNamespace, useGo } from '@app/hooks';
  import { NavBar, DayList, Tabbar } from '@/components';
  import { BasicPullRefresh, usePullRefresh } from '@app/bs-ui';
  import { reactive, ref } from 'vue';
  import { findVideoListApi } from '@/api';
  import { dateUtil } from '@app/shared';
  import { useTabbar } from './use-tabbar';
  import Swiper from './swiper.vue';
  import BasicVideo from './video.vue';
  import { computed } from 'vue';
  import CardItem from './card-item.vue';

  defineOptions({
    name: 'basic-main',
  });

  const ns = useNamespace('main');
  const go = useGo();

  const dataList = ref<any[]>([]);
  const time = ref();
  const video = reactive({
    path: '',
    cover: '',
    current: '',
  });

  const hasShowVideo = computed(() => video.path);

  const [register, { complete, error, reload, getRef }] = usePullRefresh();

  const { show } = useTabbar(getRef);

  /**
   * 获取列表数据
   * @param page
   * @param pageSize
   */
  async function queryList(page, pageSize) {
    const date = time.value || dateUtil().format('YYYY-MM-DD');

    try {
      const list = await findVideoListApi({ page, pageSize, date });

      complete(list);
    } catch (e) {
      error();
    }
  }

  /**
   * @description 点击选中的日期
   */
  function handleCurrent(value: string) {
    time.value = value;

    reload();
  }

  /**
   * @description 选中视频
   */
  function handleCurrentVideo(args: any) {
    video.current = args.id;
    video.path = args.path;
    video.cover = args.cover;
  }

  /**
   * @description 监听tabbar的改变
   */
  function handleChange(index: number) {
    switch (index) {
      case 0:
        go('/device');
        break;
      case 1:
        go('/configure');
        break;
      case 2:
        go('/custom');
        break;
      case 3:
        go('/setting');
        break;

      default:
        break;
    }
  }
</script>

<template>
  <div :class="ns.b()">
    <BasicPullRefresh @register="register" v-model="dataList" @query="queryList">
      <template #top>
        <NavBar
          bgColor="transparent"
          fixed
          :border="false"
          :theme="hasShowVideo ? 'dark' : 'light'"
        >
        </NavBar>
        <BasicVideo v-if="hasShowVideo" :url="video.path" :cover="video.cover" />
        <Swiper v-else />
      </template>
      <div :class="ns.e('list')">
        <CardItem
          v-for="(item, index) in dataList"
          :video="item"
          :key="index"
          :isAvtive="video.current === item.id"
          @click="handleCurrentVideo"
        ></CardItem>
      </div>

      <template #extend-content>
        <Tabbar :show="show" @change="handleChange" />
      </template>

      <template #left>
        <DayList @current="handleCurrent" />
      </template>
    </BasicPullRefresh>
  </div>
</template>

<style lang="scss" module>
  @include b(main) {
    @include e(list) {
      margin: 8px;
    }
  }
</style>
