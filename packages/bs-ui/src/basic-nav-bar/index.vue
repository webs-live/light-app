<script setup lang="ts">
  import { NavBar } from 'vant';
  import { basicBarNavProps } from './props';
  import { useCssVar } from '@vueuse/core';
  import { ref } from 'vue';
  import { watchEffect } from 'vue';
  import { computed } from 'vue';
  import { omit } from 'lodash-es';
  import BasicRightButton from './right-button.vue';
  import { createNavBarProviderContext } from './const';

  defineOptions({
    name: 'basic-nav-bar',
  });

  const props = defineProps(basicBarNavProps);

  const emit = defineEmits(['more', 'close', 'click-left', 'click-right']);

  const slots = defineSlots();

  const barNavDOM = ref(null);

  createNavBarProviderContext({ showShare: false });

  const colorVal = useCssVar('--van-nav-bar-background', barNavDOM, {
    initialValue: props.bgColor,
  });

  const colorLeftArrowVal = useCssVar('--van-nav-bar-icon-color', barNavDOM, {
    initialValue: props.leftArrowColor,
  });

  watchEffect(() => {
    colorVal.value = props.bgColor;
    colorLeftArrowVal.value = props.leftArrowColor;
  });

  const getBindValues = computed(() => {
    return omit(props, ['bgColor']);
  });

  function handleMore() {
    emit('more');
  }

  function handleClose() {
    emit('close');
  }

  function handleClickLeft() {
    emit('click-left');
  }

  function handleClickRight() {
    emit('click-right');
  }
</script>
<template>
  <NavBar
    ref="barNavDOM"
    v-bind="getBindValues"
    @click-left="handleClickLeft"
    @click-right="handleClickRight"
  >
    <template v-if="slots['title']" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="slots['left']" #left>
      <slot name="left"></slot>
    </template>
    <template #right>
      <slot name="right	">
        <BasicRightButton
          :header="props.header"
          :theme="props.theme"
          @close="handleClose"
          @more="handleMore"
        />
      </slot>
    </template>
  </NavBar>
</template>
