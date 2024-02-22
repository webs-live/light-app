<script setup lang="ts">
  import {} from '@app/shared';
  import { useNamespace } from '@app/hooks';
  import { Swipe, SwipeItem } from 'vant';
  import { ref } from 'vue';

  const ns = useNamespace('swiper');

  const list = ref([
    {
      title: '时光缩影',
      desc: '开启摄像头全天视频记录，自动检测会看视频，生成全天缩影',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    },
    {
      title: '智能识别',
      desc: '可识别指定对象活动画面，剪辑生成短视频',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    },
    {
      title: '应用场景',
      desc: '了解老人、孩子、宠物活动画面精彩瞬间',
      image: 'https://fastly.jsdelivr.net/npm/@vant/assets/apple-1.jpeg',
    },
  ]);
</script>

<template>
  <Swipe :class="ns.b()" :autoplay="3000" lazy-render style="height: 300px">
    <SwipeItem v-for="(item, index) in list" :key="index">
      <img style="width: 100%" :src="item.image" />
      <div :class="ns.e('header')">
        <div :class="ns.e('title')">{{ item.title }}</div>
        <div :class="ns.e('desc')">{{ item.desc }}</div>
      </div>
    </SwipeItem>
  </Swipe>
</template>
<style scoped lang="scss" module>
  @include b(swiper) {
    height: 300px;
    position: relative;

    @include e(header) {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 50px;
      color: white;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.6));
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 8px;
      padding-top: 4px;
    }

    @include e(title) {
      font-size: 13px;
      margin-bottom: 4px;
      font-weight: bold;
    }

    @include e(desc) {
      font-size: 12px;
    }
  }
</style>
