<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { Tabbar, TabbarItem } from 'vant';
  import { computed } from 'vue';
  import { ref } from 'vue';

  defineOptions({
    name: 'float-tabbar',
  });

  interface Props {
    show: boolean;
  }

  const props = withDefaults(defineProps<Props>(), {
    show: true,
  });

  const emit = defineEmits<{
    change: [index: number];
  }>();

  const getClass = computed(() => {
    return props.show ? ns.is('stop') : ns.is('move');
  });

  const ns = useNamespace('float-tabbar');

  const current = ref(5);

  /**
   * @description 切换标签时触发
   * @param index
   */
  function handleChange(index: number) {
    emit('change', index);
  }
</script>
<template>
  <div :class="[ns.b(), getClass]">
    <Tabbar v-model="current" :class="ns.e('tabbar')" :fixed="false" @change="handleChange">
      <TabbarItem icon="tv-o"> 设备 </TabbarItem>
      <TabbarItem icon="apps-o">配置 </TabbarItem>
      <TabbarItem icon="records"> 定制</TabbarItem>
      <TabbarItem icon="setting-o">设置 </TabbarItem>
    </Tabbar>
  </div>
</template>
<style lang="scss" module>
  @include b(float-tabbar) {
    position: absolute;
    left: 0;
    bottom: 10px;
    padding: 10px;
    right: 0;
    box-sizing: border-box;

    @include when(move) {
      animation: move 0.5s;
      animation-fill-mode: forwards;
    }

    @include when(stop) {
      animation: stop 0.5s;
      animation-fill-mode: forwards;
    }

    @keyframes move {
      from {
        bottom: 10px;
      }
      to {
        bottom: -80px;
      }
    }

    @keyframes stop {
      from {
        bottom: -80px;
      }
      to {
        bottom: 10px;
      }
    }

    @include e(tabbar) {
      box-shadow: 0px 1px 8px 1px rgba(0, 0, 0, 0.1);
      border-radius: 50px;
      padding: 0 20px;
      box-sizing: border-box;
    }
  }
</style>
