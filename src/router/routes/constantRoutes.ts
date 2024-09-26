import * as VueRouter from "vue-router";
import internalLayout from "@/layouts/internal.vue";

const constantRoutes: VueRouter.RouteRecordRaw[] = [
  {
    name: "Dashboard",
    path: "/dashboard",
    component: internalLayout,
    meta: {
      // requiresAuth: true,
    },
    children: [
      {
        path: "/",
        name: "Dashboard Page",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
        },
      },
      {
        path: "/master",
        name: "Master Page",
        component: () => import("@/views/master/index.vue"),
        meta: {
          title: "master",
          icon: "mdi-database",
        },
      },
      {
        path: "/visit",
        name: "Visit Page",
        component: () => import("@/views/visit/index.vue"),
        meta: {
          title: "visit",
          icon: "mdi-account",
        },
      },
      {
        path: "/report",
        name: "Report Page",
        component: () => import("@/views/report/index.vue"),
        meta: {
          title: "report",
          icon: "mdi-file-document-multiple-outline",
        },
      },
      {
        path: "/setting",
        name: "Setting Page",
        component: () => import("@/views/setting/index.vue"),
        meta: {
          title: "setting",
          icon: "mdi-cog",
        },
      },
    ],
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/auth/Login.vue"),
    meta: {
      public: true,
      hidden: true,
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/auth/Register.vue"),
    meta: {
      public: true,
      hidden: true,
    },
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

export default constantRoutes;
