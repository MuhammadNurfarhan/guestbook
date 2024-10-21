import * as VueRouter from "vue-router";
import internalLayout from "@/layouts/internal.vue";

const constantRoutes: VueRouter.RouteRecordRaw[] = [
  {
    path: "/",
    component: internalLayout,
    redirect: '/dashboard',
    meta: {
      title: "Guestbook",
      icon: "mdi-book-open-page-variant-outline",
    },
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index.vue'),
        meta: { title: 'Dashboard', icon: 'mdi-view-dashboard' },
      },
      {
        path: 'visit',
        component: () => import('@/views/visit/index.vue'),
        meta: { title: 'Visit', icon: 'mdi-account' },
      },
      {
        path: 'report',
        component: () => import('@/views/report/index.vue'),
        meta: { title: 'Report', icon: 'mdi-chart-bar' },
      },
      {
        path: "/",
        meta: {
          title: "Master",
          icon: "mdi-database",
        },
        children: [
          {
            path: "vendor",
            name: "Master Vendor Page",
            component: () => import("@/views/master/MasterVendor.vue"),
            meta: {
              title: "Vendor",
              icon: "mdi-truck-delivery",
            },
          },
          {
            path: "vehicle-type",
            name: "Master Vehicle Type Page",
            component: () => import("@/views/master/MasterVehicleType.vue"),
            meta: {
              title: "Vehicle",
              icon: "mdi-car-multiple",
            },
          },
          {
            path: "identity-type",
            name: "Master Identity Type Page",
            component: () => import("@/views/master/MasterIdentityType.vue"),
            meta: {
              title: "Identity",
              icon: "mdi-card-account-details",
            },
          },
          {
            path: "destination-building",
            name: "Master Destination Building Page",
            component: () => import("@/views/master/MasterDestinationBuilding.vue"),
            meta: {
              title: "Destination",
              icon: "mdi-office-building",
            },
          },
          {
            path: "purpose",
            name: "Master Purpose Page",
            component: () => import("@/views/master/MasterVisitorPurpose.vue"),
            meta: {
              title: "Purpose",
              icon: "mdi-home-city-outline",
            },
          }
        ],
      },
    ]
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
