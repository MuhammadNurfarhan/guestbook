import { createRouter, createWebHistory } from 'vue-router';
import Layout from '../layouts/Layout.vue';

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      { path: '', component: () => import('@/views/Dashboard.vue') },
      { path: 'dashboard', component: () => import('@/views/Dashboard.vue') },
      { path: 'master', component: () => import('@/views/Master.vue') },
      { path: 'transaksi', component: () => import('@/views/Transaksi.vue') },
      { path: 'report', component: () => import('@/views/Report.vue') },
      { path: 'setting', component: () => import('@/views/Setting.vue') },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
