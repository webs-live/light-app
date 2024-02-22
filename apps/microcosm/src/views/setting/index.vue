<script setup lang="ts">
  import { NavBar } from '@/components';
  import Notice from './notice.vue';
  import Log from './log.vue';
  import Storage from './storage.vue';
  import Share from './share.vue';

  defineOptions({
    name: 'setting',
  });
</script>

<template>
  <NavBar :border="false" title="应用设置" left-arrow> </NavBar>
  <div class="p-2">
    <Notice />
    <Log />
    <Storage />
    <Share />
  </div>
</template>
