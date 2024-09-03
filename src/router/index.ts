import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Layout from '../layouts/Layout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Master from '@/views/Master.vue';
import Transaksi from '@/views/Transaksi.vue';
import Report from '@/views/Report.vue';
import Setting from '@/views/Setting.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';


const routes = [
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        component: Dashboard
      },
      {
        path: 'dashboard',
        component: Dashboard
      },
      {
        path: 'master',
        component: Master,
        // children: [
        //   {
        //     path: 'vendor',
        //     component: () => import('@/views/MasterVendor.vue'),
        //   },
        //   {
        //     path: 'car-type',
        //     component: () => import('@/views/MasterCarType.vue'),
        //   },
        //   {
        //     path: 'id-type',
        //     component: () => import('@/views/MasterIdType.vue'),
        //   },
        //   {
        //     path: 'destination-building',
        //     component: () => import('@/views/MasterDestinationBuilding.vue'),
        //   },
        //   {
        //     path: 'visitor-purpose',
        //     component: () => import('@/views/MasterVisitorPurpose.vue'),
        //   },
        // ]
      },
      {
        path: 'transaksi',
        component: Transaksi
      },
      {
        path: 'report',
        component: Report
      },
      {
        path: 'setting',
        component: Setting
      },
    ],
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.API_BASE_URL),
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
