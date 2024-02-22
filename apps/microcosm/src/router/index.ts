import { App } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/mian/main.vue'),
    },
    {
      path: '/device',
      name: 'device',
      component: () => import('@/views/device/index.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@/views/setting/index.vue'),
    },
    {
      path: '/configure',
      name: 'configure',
      component: () => import('@/views/configure/index.vue'),
    },
    {
      path: '/custom',
      name: 'custom',
      component: () => import('@/views/custom/index.vue'),
    },
    {
      path: '/video',
      name: 'video',
      component: () => import('@/views/video/index.vue'),
    },
    {
      path: '/task-setting',
      name: 'task-setting',
      component: () => import('@/views/custom/task-setting.vue'),
    },
  ],
});

export default router;

export function setupRouter(app: App) {
  app.use(router);
}
