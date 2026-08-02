import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/add-sale',
      name: 'add-sale',
      component: () => import('@/views/AddSale.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/pending-payments',
      name: 'pending-payments',
      component: () => import('@/views/PendingPayments.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/analytics',
      name: 'analytics',
      component: () => import('@/components/Analytics.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers',
      name: 'customers',
      component: () => import('@/views/CustomerList.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/customers/:id',
      name: 'customer-detail',
      component: () => import('@/views/CustomerDetail.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false, guestOnly: true },
    },
    {
      path: '/verify-sale/:id',
      name: 'verify-sale',
      component: () => import('@/views/VerifySaleView.vue'),
      meta: { requiresAuth: false }
    }
  ],
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const { data } = await supabase.auth.getSession()
  const isAuthenticated = !!data.session

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuestOnly = to.matched.some(record => record.meta.guestOnly)

  if (requiresAuth && !isAuthenticated) {
    // 1. Unauthenticated user trying to access protected route -> Redirect to login
    next({ name: 'login' })
  } else if (isGuestOnly && isAuthenticated) {
    // 2. Authenticated user trying to access login page -> Redirect to dashboard
    next({ name: 'dashboard' })
  } else {
    // 3. Allow public access or authenticated access to protected pages
    next()
  }
})

export default router
