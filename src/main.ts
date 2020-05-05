import { createApp } from 'vue'
import App from './App'
import router from './router'
import './styles/index.ts'
import './styles/app.css'

createApp(App).use(router).mount('#app')
