import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import FormatSettingView from '../views/FormatSettingView.vue'
import UserSetting from '../views/UserSettingView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import DataSettingView from '../views/DataSettingView.vue'
import AISupportView from '../views/AISupportView.vue'
import ManualSupportView from '../views/ManualSupportView.vue'
import { checkAuth, hasRole } from '../stores/userStore.js'

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
      path: '/manual-support',
      name: 'ManualSupport',
      component: ManualSupportView,
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
  // Route requires a specific role
  else if (to.meta.requiresRole) {
    if (!hasRole(to.meta.requiresRole)) {
      // Not authorized: redirect to home
      next({ name: 'home' })
    } else {
      next()
    }
  }
  // Route is for guests only (login/register) but user is authenticated
  else if (to.meta.requiresGuest && isAuthenticated) {
    // Redirect based on role: admins go to Admin Dashboard, others go to home
    if (hasRole('admin')) {
      next({ name: 'AdminDashboard' })
    } else {
      next({ name: 'home' })
    }
  }
  // Allow navigation
  else {
    next()
  }
})

export default router