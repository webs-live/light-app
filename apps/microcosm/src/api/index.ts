import { formatTime, http, sizeConver } from '@app/shared';
import { isEmpty } from 'lodash-es';

enum API {
  VIDEO_LIST = '/v1/videos',
  VIDEO = '/v1/video',
  DEVICE_LIST = '/v1/device',
  DEVICE_ENABLE = '/v1/enable',
  SETTING_NOTIFY_ENABLE = '/v1/setting/notify/enable',
  SETTING_LOG_TERM = '/v1/setting/log/term',
  SETTING_STORAGE = '/v1/setting/storage',
  SETTING_SHARE = '/v1/setting/share',
  CONFIGURE = '/v1/configure',
  TASKS = '/v1/tasks',
  TASK = 'v1/task',
  TASK_CANCEL = '/v1/task/cancel',
  TASK_REST = '/v1/task/rest',
  TASK_SETTING = '/v1/task/setting',
  STORAGE = '/v1/storage',
}

/**
 * 查询缩影后的视频列表
 * @param params
 */
export async function findVideoListApi(
  params: { page: number; pageSize: number; date?: string } = {
    page: 1,
    pageSize: 20,
  },
) {
  const res = await http.get({ url: API.VIDEO_LIST, params });

  if (res && !isEmpty(res.items)) {
    return res.items.map((item) => {
      return {
        id: item.id,
        avatar: item.avatar,
        cover: item.cover,
        create_time: item.create_time,
        duration: formatTime(item.duration),
        path: item.file,
        size: sizeConver(item.size),
        title: item.title,
      };
    });
  } else {
    return [];
  }
}

/**
 * 获取设备
 * @param
 */
export async function findDeviceListApi() {
  const res = await http.get({ url: API.DEVICE_LIST });

  if (res && !isEmpty(res)) {
    return res.map((item) => {
      return {
        id: item.id,
        avatar: item.avatar,
        on_line: item.on_line,
        title: item.title,
      };
    });
  } else {
    return [];
  }
}

/**
 * 控制设备的状态
 * @param enable
 */
export function putDeviceEnableApi(enable: boolean) {
  return http.put({
    url: API.DEVICE_ENABLE,
    data: {
      enable,
    },
  });
}

/**
 * 获取-通知的状态
 * @param enable
 */
export function findSettingNotifyEnableApi() {
  return http.get({
    url: API.SETTING_NOTIFY_ENABLE,
  });
}

/**
 * 设置-通知的状态
 * @param enable
 */
export function putSettingNotifyEnableApi(enable: boolean) {
  return http.put({
    url: API.SETTING_NOTIFY_ENABLE,
    data: {
      enable,
    },
  });
}

/**
 * 设置-记录保存的上限时间
 * @param day
 */
export function putSettingLogTermApi(day: string) {
  return http.put({
    url: API.SETTING_LOG_TERM,
    data: {
      day,
    },
  });
}

/**
 * 获取-记录保存的上限时间
 * @param
 */
export function findSettingLogTermApi() {
  return http.get({
    url: API.SETTING_LOG_TERM,
  });
}

/**
 * 获取-储存路径
 * @param
 */
export function findSettingStoragePathApi() {
  return http.get({
    url: API.SETTING_STORAGE,
  });
}

/**
 * 获取-共享的状态
 * @param enable
 */
export function findSettingShareEnableApi() {
  return http.get({
    url: API.SETTING_SHARE,
  });
}

/**
 * 设置-共享的状态
 * @param enable
 */
export function putSettingShareEnableApi(enable: boolean) {
  return http.put({
    url: API.SETTING_SHARE,
    data: {
      enable,
    },
  });
}

/**
 * 配置-缩影配置
 * @param data
 */
export function putConfigureApi(data: { week: string; startTime: string; endTime: string }) {
  return http.put({
    url: API.CONFIGURE,
    data,
  });
}

/**
 * 获取-缩影配置
 * @param
 */
export function findConfigureApi() {
  return http.get({
    url: API.CONFIGURE,
  });
}

/**
 * 获取任务列表
 * @param params
 */
export async function findTaskListApi(
  params: { page: number; pageSize: number; state?: number } = {
    page: 1,
    pageSize: 20,
  },
) {
  const res = await http.get({ url: API.TASKS, params });

  if (res && !isEmpty(res.items)) {
    return res.items.map((item) => {
      return {
        id: item.id,
        avatar: item.avatar,
        setting: item.setting,
        cover: item.cover,
        create_time: item.create_time,
        duration: formatTime(item.duration),
        path: item.file,
        size: sizeConver(item.size),
        title: item.title,
        states: item.states,
      };
    });
  } else {
    return [];
  }
}

/**
 * 获取任务详细信息
 * @param id
 */
export async function findTaskApi(id: string) {
  const res = await http.get({ url: API.TASK, params: { id } });

  return {
    id: res.id,
    avatar: res.avatar,
    cover: res.cover,
    setting: res.setting,
    create_time: res.create_time,
    duration: formatTime(res.duration),
    path: res.file,
    size: sizeConver(res.size),
    title: res.title,
    states: res.states,
  };
}

/**
 * 删除任务
 * @param id
 */
export function removeTaskApi(id: string) {
  return http.delete({ url: API.TASK, params: { id } });
}

/**
 * 取消任务
 * @param id
 */
export function cancelTaskApi(id: string) {
  return http.post({ url: API.TASK_CANCEL, params: { id } });
}

/**
 * 重试任务
 * @param id
 */
export function restTaskApi(id: string) {
  return http.post({ url: API.TASK_REST, params: { id } });
}

/**
 * 删除视频
 * @param id
 */
export function deleteVideoApi(id: string) {
  return http.delete({
    url: API.VIDEO,
    params: {
      id,
    },
  });
}

/**
 * 查询视频
 * @param id
 */
export async function findVideoApi(id: string) {
  const res = await http.get({
    url: API.VIDEO,
    params: {
      id,
    },
  });

  return {
    id: res.id,
    avatar: res.avatar,
    cover: res.cover,
    create_time: res.create_time,
    duration: formatTime(res.duration),
    path: res.file,
    size: sizeConver(res.size),
    title: res.title,
  };
}

/**
 * 查询任务配置
 * @param
 */
export function findTaskSettingApi() {
  return http.get({ url: API.TASK_SETTING });
}

/**
 * 设置任务配置
 * @param
 */
export function putTaskSettingApi(data: Record<string, any>) {
  return http.post({ url: API.TASK_SETTING, data });
}

/**
 * 储存持久化数据
 * @param data
 */
export function putStorageApi(data: Record<string, any>) {
  const str = JSON.stringify(data);
  return http.post({
    url: API.STORAGE,
    data: str,
  });
}

/**
 * 获取持久化数据
 * @param
 */
export async function findStorageApi() {
  const res = await http.get({ url: API.STORAGE });

  return res ? JSON.parse(res) : {};
}
