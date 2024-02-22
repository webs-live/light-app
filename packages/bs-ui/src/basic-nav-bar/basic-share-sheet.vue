<script setup lang="ts">
  import { ShareSheet, ShareSheetOption } from 'vant';
  import { basicShareSheetProps } from './props';
  import { useNavBarProviderContext } from './const';
  import BasicShareSheetHeader from './basic-share-sheet-header.vue';
  import { useNamespace } from '@app/hooks';
  import { refreshLightApp } from '@app/service';
  import { computed } from 'vue';

  defineOptions({
    name: 'basic-share-sheet',
  });

  const props = defineProps(basicShareSheetProps);

  const emit = defineEmits(['refresh', 'detail-light-app']);

  const ns = useNamespace('share-sheet');

  const context = useNavBarProviderContext();

  const options = [
    {
      name: '刷新',
      icon: 'revoke',
      className: ns.e('icon'),
    },
  ];

  const headerProps = computed(() => props.header);

  function handleOptions(_: ShareSheetOption, index: number) {
    switch (index) {
      case 0:
        handleRefresh();
        break;

      default:
        break;
    }
  }

  // 刷新浏览器（轻应用）
  function handleRefresh() {
    refreshLightApp();
    emit('refresh');
  }

  // 查看轻应用的详细信息
  function handleOpenDetailLightApp() {
    emit('detail-light-app');
  }
</script>
<template>
  <ShareSheet v-model:show="context.showShare" :options="options" @select="handleOptions">
    <!-- <ShareSheet v-model:show="context.showShare" @select="handleOptions"> -->
    <template #title>
      <slot name="title">
        <BasicShareSheetHeader
          @click="handleOpenDetailLightApp"
          :title="headerProps?.title"
          :src="headerProps?.src"
          :desc="headerProps?.desc"
          :rate="headerProps?.rate"
        />
      </slot>
    </template>
  </ShareSheet>
</template>

<style lang="scss" module>
  @include b(share-sheet) {
    @include e(icon) {
      color: #646566;
    }
  }
</style>
