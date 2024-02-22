<script setup lang="ts">
  import { useNamespace } from '@app/hooks';
  import { PullRefresh, List, PullRefreshProps, ListProps, Empty, Loading } from 'vant';
  import { Ref, onMounted, reactive, ref, CSSProperties } from 'vue';
  import { useRefreshHeight } from './use-refresh-height';
  import { Nullable } from '@app/types';
  import { computed, unref } from 'vue';
  import { deepMerge } from '@app/shared';
  import {
    BasicPullRefreshActionType,
    BasicPullRefreshProps,
    basicPullRefreshProps,
  } from './props';
  import { watch } from 'vue';
  import {
    DEFAULT_FINSIHES_TEXT,
    DEFAULT_LIST_ERROR_TEXT,
    DEFAULT_LIST_LOADING_TEXT,
    DEFAULT_PAGE,
    DEFAULT_PAGE_SIZE,
  } from './const';

  const ns = useNamespace('basic-pull-refresh');

  defineOptions({
    name: 'basic-pull-refresh',
  });

  const emit = defineEmits(['register', 'query', 'update:modelValue']);

  const props = defineProps(basicPullRefreshProps);
  const propsRef = ref<Partial<BasicPullRefreshProps>>({});
  const page = reactive({
    inited: false,
    loading: false,
    empty: false,
    error: false,
  });
  const model = reactive({
    refreshing: false,
    loading: false,
    erroring: false,
    finished: true,
  });
  const pager = reactive({
    page: DEFAULT_PAGE,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const mainDomRef = ref<Nullable<HTMLElement>>(null);
  const topDomRef = ref<Nullable<HTMLElement>>(null);
  const bottomDomRef = ref<Nullable<HTMLElement>>(null);
  const pullRefreshDomRef = ref<Nullable<HTMLElement>>(null);
  const dataList = ref<any[]>([]);

  const { height } = useRefreshHeight({
    mainDom: mainDomRef as Ref<HTMLElement>,
    topDom: topDomRef as Ref<HTMLElement>,
    bottomDom: bottomDomRef as Ref<HTMLElement>,
  });

  const getProps = computed((): BasicPullRefreshProps => {
    return { ...props, ...unref(propsRef) };
  });

  const getPullProps = computed<Partial<PullRefreshProps>>(() => {
    return {
      modelValue: model.refreshing,
      disabled: !unref(getProps).refresherEnabled,
      loadingText: unref(getProps).pullLoadingText,
      loosingText: unref(getProps).pullLoosingText,
      successText: unref(getProps).pullSuccessText,
      pullingText: unref(getProps).pullingText,
    };
  });

  const getListProps = computed<Partial<ListProps>>(() => {
    return {
      disabled: !unref(getProps).loadingMoreEnabled,
      offset: unref(getProps).offset,
      loadingText: unref(getProps).loadingText || DEFAULT_LIST_LOADING_TEXT,
      finishedText: unref(getProps).finishedText || DEFAULT_FINSIHES_TEXT,
      errorText: unref(getProps).errortext || DEFAULT_LIST_ERROR_TEXT,
    };
  });

  const getContentHeight = computed<CSSProperties>(() => {
    return {
      height: `${height.value}px`,
    };
  });

  /**
   * @description 下拉刷新列表
   */
  function handleRefresh() {
    // 下拉刷新重置上拉加载状态
    model.finished = false;
    model.refreshing = true;

    pager.page = 0;

    loadDate();
  }

  /**
   * @description 初始化加载，只在页面进入第一次加载数据中调用
   */
  function handleInited() {
    model.finished = false;

    pager.page = 0;

    loadDate();
  }

  /**
   * @description 上拉加载数据
   */
  function handleLoad() {
    model.finished = false;
    model.loading = true;
    loadDate();
  }

  /**
   * @description 加载数据
   */
  function loadDate() {
    page.loading = true;

    pager.page++;

    emit('query', pager.page, pager.pageSize);
  }

  /**
   * @description 接收用户传递的数据
   * @param data
   */
  function complete(data: any[]) {
    // 1. 获取数据
    let list: any[] = [];
    if (model.refreshing || page.inited) {
      // model.refreshing == true 说明当前是刷新状态
      list = data;
      model.refreshing = false;
    } else {
      if (data?.length < pager.pageSize) {
        pager.page--;
        model.finished = true;
      }
      model.loading = false;

      list = dataList.value.concat(data ?? []);
    }

    page.inited = false;
    page.loading = false;
    page.error = false;

    emit('update:modelValue', list);
  }

  /**
   * @description 刷新列表
   * @param data
   */
  function reload() {
    handleRefresh();
  }

  /**
   * @description 失败警告
   * @param _
   */
  function error(_?: string) {
    page.inited = false;

    if (model.refreshing) {
      page.error = false;
      model.erroring = true;
    } else {
      model.erroring = false;
      page.error = true;
    }
    model.loading = false;
    model.refreshing = false;
  }

  /**
   * 函数试传递props
   * @param props
   */
  function setProps(props: Partial<BasicPullRefreshProps>) {
    propsRef.value = deepMerge(propsRef, props);
  }

  /**
   * @description 初始化数据
   */
  function initDefaults() {
    if (unref(getProps).immediate) {
      page.inited = true;
      handleInited();
    }
  }

  const actionType: Partial<BasicPullRefreshActionType> = {
    error,
    reload,
    complete,
    setProps,
    getRef,
  };

  function getRef() {
    return {
      pullRefreshDom: pullRefreshDomRef,
    };
  }

  onMounted(() => {
    emit('register', actionType);
    initDefaults();
  });

  watch(
    () => props.pager,
    (p) => {
      pager.page = p.page;
      pager.pageSize = p.pageSize;
    },
    {
      deep: true,
      immediate: true,
    },
  );

  watch(
    () => unref(getProps)?.modelValue,
    () => {
      dataList.value = unref(getProps)?.modelValue as any;
    },
    {
      immediate: true,
    },
  );

  watch(
    () => dataList.value,
    () => {
      if (dataList.value.length === 0) {
        model.refreshing = false;
        model.erroring = false;
        model.finished = true;
        model.loading = false;
        page.empty = true;
      } else {
        page.empty = false;
      }
    },
  );

  defineExpose<BasicPullRefreshActionType>({
    complete,
    reload,
    error,
    setProps,
    getRef,
  });
</script>
<template>
  <div ref="mainDomRef" :class="ns.b()">
    <div ref="topDomRef" :class="ns.e('top')">
      <slot name="top"> </slot>
    </div>
    <div :class="ns.e('content')">
      <div :class="ns.e('content-left')" :style="getContentHeight">
        <slot name="left"> </slot>
      </div>
      <div :class="ns.e('content-main')" :style="getContentHeight">
        <slot name="extend-content"></slot>
        <PullRefresh
          ref="pullRefreshDomRef"
          :class="ns.e('refresh')"
          v-bind="getPullProps"
          v-model="model.refreshing"
          @refresh="handleRefresh"
        >
          <div v-if="page.empty" :class="ns.e('empty')">
            <slot name="empty">
              <Empty v-bind="$props.empty" />
            </slot>
          </div>
          <div v-else-if="page.error" :class="ns.e('error')">
            <slot name="error">
              <Empty v-bind="$props.error" />
            </slot>
          </div>
          <div v-else-if="page.inited" :class="ns.e('inited')">
            <slot name="inited">
              <Loading type="spinner"></Loading>
            </slot>
          </div>
          <List
            v-else
            v-bind="getListProps"
            v-model:loading="model.loading"
            v-model:error="model.erroring"
            :finished="model.finished"
            :immediate-check="false"
            @load="handleLoad"
          >
            <slot></slot>
          </List>
        </PullRefresh>
      </div>
      <div :class="ns.e('content-right')" :style="getContentHeight">
        <slot name="right"></slot>
      </div>
    </div>
    <div ref="bottomDomRef" :class="ns.e('bottom')">
      <slot name="bottom"></slot>
    </div>
  </div>
</template>
<style lang="scss" module>
  @include b(basic-pull-refresh) {
    height: 100vh;
    width: 100vw;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    @include e(inited) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    @include e(empty) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    @include e(error) {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
    }

    @include e(refresh) {
      width: 100%;
      overflow: auto;
    }

    @include e(top) {
      z-index: 999;
    }

    @include e(content) {
      flex: 1;
      display: flex;
    }

    @include e(content-left) {
    }

    @include e(content-main) {
      flex: 1;
      display: flex;
      overflow: auto;
      position: relative;
    }

    @include e(bottom) {
    }
  }
</style>
