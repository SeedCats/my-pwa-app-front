import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormatSettingView from '../views/FormatSettingView.vue'
import UserSetting from '../views/UserSettingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DataSettingView from '../views/DataSettingView.vue'
import aiSupportView from '../views/aiSupportView.vue'
import ManualSupportView from '../views/ManualSupportView.vue'

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
    {
      path: '/addData',
      name: 'AddData',
      component: DataSettingView
    },
    {
      path: '/ai-support',
      name: 'AiSupport',
      component: aiSupportView
    },
    {
      path: '/manual-support',
      name: 'ManualSupport',
      component: ManualSupportView
    }
  ]
})

export default router