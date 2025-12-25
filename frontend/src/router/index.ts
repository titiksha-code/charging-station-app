import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/stations',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresGuest: true },
    },
    {
      path: '/stations',
      name: 'stations',
      component: () => import('@/views/StationsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/map',
      name: 'map',
      component: () => import('@/views/MapView.vue'),
      meta: { requiresAuth: true },
    },
  ],
});

// Navigation guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login');
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/stations');
  } else {
    next();
  }
});

export default router;