import 'uno.css';
import 'modern-normalize';
import '@app/design';
import 'vant/lib/index.css';
import './styles/index.scss';

import { createApp } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './stores';
import { initAppConfig } from './initAppConfig';
import { setupHttp } from './http';
import { initComponent } from './initComponent';

async function bootstrap() {
  const app = createApp(App);

  initAppConfig();

  initComponent();

  setupHttp();

  setupStore(app);

  setupRouter(app);

  app.mount('#app');
}

bootstrap();
