<script setup lang="ts">
  import { putSettingLogTermApi, findSettingLogTermApi } from '@/api';
  import { CellGroup, showLoadingToast, Picker, Popup, showConfirmDialog, showToast } from 'vant';
  import { onMounted, ref, h } from 'vue';
  import { BasicCell } from '@app/bs-ui';
  import { usePermission } from '@app/service';

  const defaultLoading = ref(false);
  const show = ref(false);
  const text = ref('永久');
  const selectedValues = ref(['永久']);

  const columns = ref([
    { text: '永久', value: '永久' },
    { text: '7天', value: '7天' },
    { text: '15天', value: '15天' },
    { text: '30天', value: '30天' },
  ]);

  const { hasPermission } = usePermission();

  onMounted(() => {
    initDefaults();
  });

  /**
   * 初始化值
   * @param
   */
  async function initDefaults() {
    defaultLoading.value = true;
    try {
      const day = await findSettingLogTermApi();
      selectedValues.value = [day];
      text.value = day;
      defaultLoading.value = false;
    } catch (error) {}
  }

  /**
   * 打开选择框
   * @param
   */
  function handleOpen() {
    if (hasPermission('0')) {
      showToast('您没有操作权限');
      return;
    }

    show.value = true;
  }

  /**
   * 修改记录保存的上限日期
   * @param { selectedOptions }
   */
  async function handleSaveLog({ selectedOptions }) {
    const key = selectedOptions[0].text;
    const value = selectedOptions[0].value;

    if (key == text.value) return;
    let message = h('span', [
      h('span', '设置'),
      h('span', { style: 'color: red' }, key),
      h('span', '保存上限后，'),
      h('span', { style: 'color: red' }, key),
      h('span', '之前数据将会删除，且不能恢复，确定设置为'),
      h('span', { style: 'color: red' }, key),
      h('span', '保存上限么？'),
    ]);
    if (key === '永久') {
      message = h('span', [
        h('span', '设置为'),
        h('span', { style: 'color: red' }, key),
        h('span', '，保存后数据将会永久保存，确定设置为'),
        h('span', { style: 'color: red' }, key),
        h('span', '保存么？'),
      ]);
    }
    showConfirmDialog({
      message: () => message,
    }).then(async () => {
      show.value = false;

      const loading = showLoadingToast({});
      try {
        await putSettingLogTermApi(value);

        text.value = key;
      } catch (error) {
      } finally {
        loading.close();
      }
    });
  }
</script>

<template>
  <CellGroup inset>
    <template #title>
      <div class="text-black">应用记录保存</div>
      <div class="text-sm text-gray-400 mt-1">定期清除您的保存记录</div>
    </template>
    <BasicCell
      :loading="defaultLoading"
      title="记录保存上限"
      :value="text"
      is-link
      @click="handleOpen"
    >
    </BasicCell>
  </CellGroup>
  <Popup v-model:show="show" round position="bottom">
    <Picker
      v-model="selectedValues"
      title="应用保存上限"
      :columns="columns"
      @cancel="show = false"
      @confirm="handleSaveLog"
    />
  </Popup>
</template>
