<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { RouterView } from 'vue-router';
  import { Agreement } from '@/views/agreement';

  const ns = useNamespace('app');
</script>

<template>
  <div :class="ns.b()">
    <RouterView />
  </div>
  <Agreement />
</template>

<style lang="scss" module>
  @include b('app') {
    height: 100%;
    width: 100%;
    background-color: #f2f2f2;
  }
</style>
