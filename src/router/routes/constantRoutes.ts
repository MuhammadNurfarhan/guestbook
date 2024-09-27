import * as VueRouter from "vue-router";
import internalLayout from "@/layouts/internal.vue";

const constantRoutes: VueRouter.RouteRecordRaw[] = [
  {
    path: "/",
    component: internalLayout,
    redirect: "/dashboard",
    meta: {
      title: "Dashboard",
      icon: "mdi-home",
      // requireAuth: true,
    },
    children: [
      {
        name: "Dashboard",
        path: "/dashboard",
        component: () => import("@/views/dashboard/index.vue"),
        meta: {
          title: "Dashboard",
          icon: "mdi-view-dashboard",
        },
      },
    ],
  },
  {
    path: "/",
    component: internalLayout,
    meta: {
      title: "visit",
      icon: "mdi-account",
    },
    children: [
      {
        path: "/visit",
        name: "Visit Page",
        component: () => import("@/views/visit/index.vue"),
        meta: {
          title: "visitor",
          icon: "mdi-account",
        },
      },
    ],
  },
  {
    path: "/",
    component: internalLayout,
    meta: {
      title: "master",
      icon: "mdi-database",
    },
    children: [
      {
        path: "vendor",
        name: "Master Vendor Page",
        component: () => import("@/views/master/MasterVendor.vue"),
        meta: {
          title: "vendor",
          icon: "mdi-truck-delivery",
        },
      },
      {
        path: "vehicle-type",
        name: "Master Vehicle Type Page",
        component: () => import("@/views/master/MasterVehicleType.vue"),
        meta: {
          title: "vehicle-type",
          icon: "mdi-car-multiple",
        },
      },
      {
        path: "identity-type",
        name: "Master Identity Type Page",
        component: () => import("@/views/master/MasterIdentityType.vue"),
        meta: {
          title: "identity-type",
          icon: "mdi-card-account-details",
        },
      },
      {
        path: "destination-building",
        name: "Master Destination Building Page",
        component: () => import("@/views/master/MasterDestinationBuilding.vue"),
        meta: {
          title: "destination",
          icon: "mdi-office-building",
        },
      },
      {
        path: "purpose",
        name: "Master Purpose Page",
        component: () => import("@/views/master/MasterVisitorPurpose.vue"),
        meta: {
          title: "purpose",
          icon: "mdi-account-group",
        },
      }
    ],
  },
  {
    path: "/",
    component: internalLayout,
    meta: {
      title: "report",
      icon: "mdi-file-document-multiple-outline",
    },
    children: [
      {
        path: "report",
        name: "Report Page",
        component: () => import("@/views/report/index.vue"),
        meta: {
          title: "visitor report",
          icon: "mdi-file-document-multiple-outline",
        },
      },
    ],
  },
  {
    path: "/",
    component: internalLayout,
    meta: {
      title: "setting",
      icon: "mdi-cog",
    },
    children: [
      {
        path: "setting",
        name: "Setting Page",
        component: () => import("@/views/setting/index.vue"),
        meta: {
          title: "user",
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
