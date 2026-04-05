import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth, hasRole } from '../stores/userStore.js'
import { prefetchHealthDataForOffline } from '../services/offlinePrefetchService'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: () => import('../views/LoginView.vue'),
      meta: { requiresGuest: true }  // Only accessible when NOT logged in
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../views/RegisterView.vue'),
      meta: { requiresGuest: true }  // Only accessible when NOT logged in
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      meta: { requiresAuth: true }   // Requires authentication
    },
    {
      path: '/setting',
      name: 'FormatSetting',
      component: () => import('../views/FormatSettingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/user',
      name: 'UserSetting',
      component: () => import('../views/UserSettingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/data-setting',
      name: 'DataSetting',
      component: () => import('../views/DataSettingView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/ai-support',
      name: 'AiSupport',
      component: () => import('../views/AISupportView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/chat',
      name: 'Chat',
      component: () => import('../views/ChatView.vue'),
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
    },
    {
      path: '/admin/bookings',
      name: 'AdminBooking',
      component: () => import('../views/adminView/AdminBookingView.vue'),
      meta: { requiresAuth: true, requiresRole: 'admin' }
    }
  ]
})

router.beforeEach(async (to, _from, next) => {
  const isAuthenticated = await checkAuth()
  if (isAuthenticated) {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => prefetchHealthDataForOffline().catch(() => {}))
    } else {
      setTimeout(() => prefetchHealthDataForOffline().catch(() => {}), 2000)
    }
  }

  if (to.meta.requiresAuth && !isAuthenticated) next({ name: 'Login' })
  else if (to.meta.requiresRole && !hasRole(to.meta.requiresRole)) next({ name: 'home' })
  else if (to.meta.requiresGuest && isAuthenticated) next({ name: hasRole('admin') ? 'AdminDashboard' : 'home' })
  else next()
})

export default router