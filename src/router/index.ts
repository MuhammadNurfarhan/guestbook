import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import Layout from '../layouts/Layout.vue';
import Dashboard from '@/views/dashboard/index.vue';
import Master from '@/views/master/index.vue';
import Visit from '@/views/visit/index.vue';
import Report from '@/views/report/index.vue';
import Setting from '@/views/setting/index.vue';
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
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'Dashboard' },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
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
        path: 'visit',
        component: Visit
      },
      {
        path: 'report',
        component: Report
      },
      {
        path: 'setting',
        name: 'Setting',
        component: Setting,
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
  },
  {
    name: "404",
    path: "/404",
    component: () => import("@/views/404.vue"),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    meta: {
      hidden: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  authStore.restoreUser()

  if (to.meta.requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      next({ name: 'Login' });
    } else {
      next();
    }
  } else {
    next();
  }
});


export default router;
