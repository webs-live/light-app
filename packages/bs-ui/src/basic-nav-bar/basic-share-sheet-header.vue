<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Image } from 'vant';
  import { Icon } from '@app/ui';
  import { basicShareSheetHeaderProps } from './props';

  defineOptions({
    name: 'basic-share-sheet-header',
  });

  const ns = useNamespace('header');

  defineProps(basicShareSheetHeaderProps);

  const emit = defineEmits(['click']);

  // 查询轻应用基本信息
  function handleClick() {
    emit('click');
  }
</script>

<template>
  <div :class="ns.b()">
    <div :class="ns.e('left')">
      <Image width="40" height="40" :radius="4" :src="src"></Image>
      <div :class="ns.e('content')" @click.stop="handleClick">
        <div :class="ns.e('title')">
          {{ title }}
          <Icon
            :class="ns.e('icon')"
            icon="ic:baseline-keyboard-arrow-right"
            color="gray"
            :size="16"
          />
        </div>
        <div :class="ns.e('desc')"> {{ desc }} </div>
      </div>
    </div>
    <div :class="ns.e('right')">
      <span :class="ns.e('num')">{{ rate }}</span>
      <div :class="ns.e('desc')"> 评分 </div>
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b(header) {
    display: flex;
    justify-content: space-between;
    align-items: center;

    @include e(left) {
      display: flex;

      @include e(content) {
        margin-left: 8px;
        display: flex;
        flex-direction: column;
        align-items: self-start;
        justify-content: center;
      }

      @include e(title) {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 2px;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      @include e(icon) {
        margin-left: 2px;
      }

      @include e(desc) {
        font-size: 12px;
        color: gray;
      }
    }

    @include e(right) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      @include e(num) {
        font-size: 16px;
        color: orange;
        font-weight: bold;
      }

      @include e(desc) {
        font-size: 12px;
        font-weight: 500;
        color: gray;
      }
    }
  }
</style>
