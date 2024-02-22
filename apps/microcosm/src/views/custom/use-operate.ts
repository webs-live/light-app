import { cancelTaskApi, deleteVideoApi, restTaskApi } from '@/api';
import { BasicPullRefreshActionType } from '@app/bs-ui';
import { AnyPromiseFunction } from '@app/types';
import { ActionSheetAction, showLoadingToast, showConfirmDialog } from 'vant';
import { reactive } from 'vue';
import { downloadByUrl } from '@app/shared';

export function useOperate(
  methods: BasicPullRefreshActionType & { findTaskList: AnyPromiseFunction },
) {
  const model = reactive<{
    show: boolean;
    actions: ActionSheetAction[];
  }>({
    show: false,
    actions: [],
  });

  /**
   * 查看更多
   * @param task
   */
  function handleMore(task: Record<string, any>, type: number = 0) {
    model.actions = [];
    if (type === 0) {
      if (task.states == 1) {
        model.actions.push({ name: '取消任务', callback: () => handleCancel(task.id) });
      }
      if (task.states == -1 || task.states == 3) {
        model.actions.push({ name: '重试', callback: () => handleRest(task.id) });
      }
      model.actions.push({ name: '删除任务', callback: () => handleRemoveTask(task.id) });
    } else {
      model.actions = [
        { name: '下载视频', callback: () => handleDowload(task) },
        { name: '删除视频', callback: () => handleRemoveVideo(task.id) },
      ];
    }

    model.show = true;
  }

  /**
   * 取消任务
   * @param id
   */
  async function handleCancel(id: string) {
    model.show = false;
    const loading = showLoadingToast({});
    try {
      await cancelTaskApi(id);
      await methods.findTaskList();
    } catch (error) {
    } finally {
      loading.close();
    }
  }

  /**
   * 重试任务
   * @param id
   */
  async function handleRest(id: string) {
    model.show = false;
    const loading = showLoadingToast({});
    try {
      await restTaskApi(id);
      await methods.findTaskList();
    } catch (error) {
    } finally {
      loading.close();
    }
  }

  /**
   * 删除任务
   * @param id
   */
  async function handleRemoveTask(id: string) {
    showConfirmDialog({
      title: '确定删除任务么？',
      message: '任务删除后，将从任务列表删除',
    })
      .then(async () => {
        model.show = false;
        const loading = showLoadingToast({});
        try {
          await restTaskApi(id);
          await methods.findTaskList();
        } catch (error) {
        } finally {
          loading.close();
        }
      })
      .catch(() => {});
  }

  /**
   * 下载视频
   * @param video
   */
  function handleDowload(video: Record<string, any>) {
    downloadByUrl({ url: video.path });
  }

  /**
   * 删除视频
   * @param id
   */
  function handleRemoveVideo(id: string) {
    showConfirmDialog({
      title: '确定删除文件么？',
      message: '文件删除后，对应的储存文件也将被永久删除，且不能回复',
    })
      .then(async () => {
        model.show = false;
        const loading = showLoadingToast({});
        try {
          await deleteVideoApi(id);
          methods.reload();
        } catch (error) {
        } finally {
          loading.close();
        }
      })
      .catch(() => {});
  }

  return {
    model,
    handleMore,
  };
}
