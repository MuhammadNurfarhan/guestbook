import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layouts/Layout.vue';
import { useAuthStore } from '@/stores/authStore';


const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      { path: '', component: () => import('@/views/Dashboard.vue') },
      { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'master', component: () => import('@/views/Master.vue') },
      { path: 'transaksi', component: () => import('@/views/Transaksi.vue') },
      { path: 'report', component: () => import('@/views/Report.vue') },
      { path: 'setting', component: () => import('@/views/Setting.vue') },
    ],
  },
  {
    path: '/login',
    component: () => import('@/components/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('@/components/Register.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.API_BASE_UR),
  routes,
});

// Navigation guard for protected routes
// router.beforeEach((to, from, next) => {
//   const authStore = useAuthStore();
//   if (to.meta.requiresAuth && !authStore.token) {
//     next('/login');
//   } else {
//     next();
//   }
// });

export default router;
