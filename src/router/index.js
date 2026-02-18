import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormatSettingView from '../views/FormatSettingView.vue'
import UserSetting from '../views/UserSettingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DataSettingView from '../views/DataSettingView.vue'
import AISupportView from '../views/AISupportView.vue'
import ChatView from '../views/ChatView.vue'
import { checkAuth, hasRole } from '../stores/userStore.js'
import { prefetchHealthDataForOffline } from '../services/offlinePrefetchService'

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
      component: AISupportView,
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: ChatView,
      meta: { requiresAuth: true }
    },
    {
      path: '/booking-system',
      name: 'BookingSystem',
      component: () => import('../views/BookingSystemView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'AdminDashboard',
      component: () => import('../views/adminView/AdminDashboard.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    },
    {
      path: '/admin/users',
      name: 'UserManagement',
      component: () => import('../views/adminView/UserManagementView.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    },
    {
      path: '/admin/chats',
      name: 'AdminChat',
      component: () => import('../views/adminView/AdminChatView.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = await checkAuth()
  if (isAuthenticated) prefetchHealthDataForOffline().catch(() => {})

  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'Login' })
  else if (to.meta.requiresRole && !hasRole(to.meta.requiresRole)) next({ name: 'home' })
  else if (to.meta.requiresGuest && isAuthenticated) next({ name: hasRole('admin') ? 'AdminDashboard' : 'home' })
  else next()
})

export default router