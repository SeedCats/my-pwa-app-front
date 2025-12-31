import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormatSettingView from '../views/FormatSettingView.vue'
import UserSetting from '../views/UserSettingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DataSettingView from '../views/DataSettingView.vue'
import aiSupportView from '../views/AISupportView.vue'
import ManualSupportView from '../views/ManualSupportView.vue'
import { checkAuth } from '../stores/userStore.js'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: LoginView,
      meta: { requiresGuest: true }  // Only accessible when NOT logged in
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
      meta: { requiresGuest: true }  // Only accessible when NOT logged in
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }   // Requires authentication
    },
    {
      path: '/setting',
      name: 'FormatSetting',
      component: FormatSettingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'UserSetting',
      component: UserSetting,
      meta: { requiresAuth: true }
    },
    {
      path: '/data-setting',
      name: 'DataSetting',
      component: DataSettingView,
      meta: { requiresAuth: true }
    },
    {
      path: '/ai-support',
      name: 'AiSupport',
      component: aiSupportView,
      meta: { requiresAuth: true }
    },
    {
      path: '/manual-support',
      name: 'ManualSupport',
      component: ManualSupportView,
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard middleware (uses cached auth check)
router.beforeEach(async (to, from, next) => {
  const isAuthenticated = await checkAuth()
  
  // Route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login page
    next({ name: 'Login' })
  }
  // Route is for guests only (login/register) but user is authenticated
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect to home page
    next({ name: 'home' })
  }
  // Allow navigation
  else {
    next()
  }
})

export default router