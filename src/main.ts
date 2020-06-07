import { createApp } from 'vue';
import App from './App';
import { router } from './router';
import './styles/index.css';
import './styles/app.css';

createApp(App).use(router).mount('#app');
