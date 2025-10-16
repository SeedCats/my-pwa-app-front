import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormatSettingView from '../views/FormatSettingView.vue'
import UserSetting from '../views/UserSettingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView
    },
    {
      path: '/setting',
      name: 'FormatSetting',
      component: FormatSettingView
    },
    {
      path: '/user',
      name: 'UserSetting',
      component: UserSetting
    },
  ]
})

export default router