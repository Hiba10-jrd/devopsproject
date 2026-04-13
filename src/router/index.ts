import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/HomePage.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/pages/SearchPage.vue'),
  },
  {
    path: '/listing/:id',
    name: 'ListingDetails',
    component: () => import('@/pages/ListingDetailsPage.vue'),
  },
  {
    path: '/booking/:id',
    name: 'Booking',
    component: () => import('@/pages/BookingPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
  },
  {
    path: '/host',
    name: 'HostDashboard',
    component: () => import('@/pages/HostDashboard.vue'),
    meta: { requiresAuth: true, requiresHost: true },
  },
  {
    path: '/client',
    name: 'ClientDashboard',
    component: () => import('@/pages/ClientDashboard.vue'),
    meta: { requiresAuth: true, requiresClient: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/AdminDashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/')
  } else if (to.meta.requiresHost && !authStore.isHost) {
    next('/')
  } else if (to.meta.requiresClient && authStore.currentUser?.role !== 'client') {
    next('/')
  } else {
    next()
  }
})

export default router
