import { createRouter, createWebHistory } from 'vue-router';
import constantRoutes from './routes/constantRoutes';


const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
});

export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}


export default router;
