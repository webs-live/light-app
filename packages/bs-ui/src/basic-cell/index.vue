<script setup lang="ts">
  import { Cell, Loading, cellProps } from 'vant';
  import { computed } from 'vue';
  import { omit } from 'lodash-es';

  const props = defineProps({
    ...cellProps,
    loading: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['click']);
  const slots = defineSlots();

  const getBindProps = computed(() => {
    if (props.loading) {
      return omit(props, ['loading', 'isLink', 'value']);
    } else {
      return omit(props, ['loading']);
    }
  });

  const hasTitleSlot = computed(() => slots?.title);
  const hasLabelSlot = computed(() => slots?.label);
  const hasIconSlot = computed(() => slots?.icon);
  const hasValueSlot = computed(() => slots?.value && !props.loading);
  const hasRightIconSlot = computed(() => slots?.['right-icon'] && !props.loading);
  const hasExtraSlot = computed(() => props.loading);

  function handleClick() {
    emit('click');
  }
</script>
<template>
  <Cell v-bind="getBindProps" @click="handleClick">
    <template v-if="hasTitleSlot" #title>
      <slot name="title"></slot>
    </template>
    <template v-if="hasLabelSlot" #label>
      <slot name="label"></slot>
    </template>
    <template v-if="hasIconSlot" #icon>
      <slot name="icon"></slot>
    </template>
    <template v-if="hasValueSlot" #value>
      <slot name="value"></slot>
    </template>
    <template v-if="hasRightIconSlot" #right-icon>
      <slot name="right-icon"></slot>
    </template>
    <template v-if="hasExtraSlot" #extra>
      <slot name="extra">
        <Loading type="spinner" :size="18"></Loading>
      </slot>
    </template>
  </Cell>
</template>
<style module lang="scss"></style>
