import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Layout from '../layouts/Layout.vue';
import Dashboard from '@/views/Dashboard.vue';
import Master from '@/views/master/Master.vue';
import Transaksi from '@/views/Transaksi.vue';
import Report from '@/views/Report.vue';
import Setting from '@/views/Setting.vue';
import Login from '@/components/Login.vue';
import Register from '@/components/Register.vue';
import MasterVendor from '@/views/master/MasterVendor.vue';
import MasterVehicleType from '@/views/master/MasterVehicleType.vue';
import MasterIdentityType from '@/views/master/MasterIdentityType.vue';
import MasterDestinationBuilding from '@/views/master/MasterDestinationBuilding.vue';
import MasterVisitorPurpose from '@/views/master/MasterVisitorPurpose.vue';


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
      },
      {
        path: '/master/vendor',
        component: MasterVendor,
      },
      {
        path: '/master/vehicle-type',
        component: MasterVehicleType,
      },
      {
        path: '/master/identity-type',
        component: MasterIdentityType,
      },
      {
        path: '/master/destination-building',
        component: MasterDestinationBuilding,
      },
      {
        path: '/master/visitor-purpose',
        component: MasterVisitorPurpose,
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

router.beforeEach((to, from, next) => {
  const isAuthenticated = !localStorage.getItem('token'); // Check if JWT exists

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!isAuthenticated) {
      next('/login'); // Redirect to login if not authenticated
    } else {
      next(); // Proceed to the route
    }
  } else {
    next(); // Proceed if the route does not require authentication
  }
});

export default router;
