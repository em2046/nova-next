import { createApp } from 'vue';
import App from './App';
import router from './router';
import './styles/index.less';
import './styles/app.less';

createApp(App).use(router).mount('#app');
