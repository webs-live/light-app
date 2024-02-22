<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Icon } from '@app/ui';
  import { computed, CSSProperties } from 'vue';
  import { basicRightButtonProps } from './props';
  import BasicShareSheet from './basic-share-sheet.vue';
  import { useNavBarProviderContext } from './const';
  import { exitLightApp } from '@app/service';

  defineOptions({
    name: 'basic-right-button',
  });

  const props = defineProps(basicRightButtonProps);
  const emit = defineEmits(['more', 'close']);

  const ns = useNamespace('basic-right-button');

  const context = useNavBarProviderContext();

  const bgColor = computed<CSSProperties>(() => {
    return props.theme == 'light'
      ? {
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
        }
      : {
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        };
  });

  const iconColor = computed(() => {
    return props.theme == 'light' ? '#fff' : '#000';
  });

  function handleMore() {
    context.showShare = true;
    emit('more');
  }

  function handleClose() {
    exitLightApp();
    emit('close');
  }
</script>

<template>
  <div :class="ns.b()" :style="bgColor" style="display: none">
    <Icon
      icon="material-symbols:more-horiz"
      :size="18"
      :color="iconColor"
      @click.stop="handleMore"
    ></Icon>
    <div :class="ns.e('line')"></div>
    <Icon
      icon="material-symbols:cancel-outline"
      :size="18"
      :color="iconColor"
      @click.stop="handleClose"
    ></Icon>
  </div>
  <BasicShareSheet :header="props.header" style="display: none" />
</template>
<style lang="scss" module>
  @include b(basic-right-button) {
    display: flex;
    justify-items: center;
    align-items: center;
    border-radius: 100px;
    padding: 6px 12px;
    border: 1px solid rgba(0, 0, 0, 0.05);

    @include e(line) {
      margin: 0 10px;
      background-color: rgba(0, 0, 0, 0.05);
      width: 0.5px;
      height: 12px;
    }
  }
</style>
