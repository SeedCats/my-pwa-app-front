import { createApp } from 'vue'
import App from './views/HomeView.vue'
import router from './router'
import './style.css'

createApp(App).use(router).mount('#app')