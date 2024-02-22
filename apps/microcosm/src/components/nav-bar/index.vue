<script setup lang="ts">
  import { BasicNavBar, basicBarNavProps, type BasicBarNavProps } from '@app/bs-ui';
  import { computed } from 'vue';
  import { omit } from 'lodash-es';
  import { useBack } from '@app/hooks';
  import { definePropType } from '@app/shared';

  defineOptions({
    name: 'nav-bar',
  });

  const props = defineProps({
    ...omit(basicBarNavProps, ['header']),
    beforeBack: {
      type: definePropType<() => boolean>(Function),
    },
  });

  const back = useBack();

  const getBindValues = computed<BasicBarNavProps>(() => {
    return {
      ...props,
    };
  });

  async function handleClickLeft() {
    const fn = (props.beforeBack && (await props.beforeBack())) ?? true;

    fn && back();
  }
</script>

<template>
  <BasicNavBar v-bind="getBindValues" @click-left="handleClickLeft"> </BasicNavBar>
</template>
