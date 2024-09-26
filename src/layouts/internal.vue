<script lang="ts" setup>
import router from "@/router";
import constantRoutes from "@/router/routes/constantRoutes";
import { useWebsiteStore } from "@/stores/modules/website";
import { useRouteStore } from "@/stores/modules/route";

const website = useWebsiteStore();
const routeStore = useRouteStore();

onBeforeMount(async () => {
  const accessRoutes = await routeStore.setRoutes(constantRoutes, [
    "administrator",
  ]);
  accessRoutes.forEach((item: any) => {
    router.addRoute(item);
  });
});
</script>

<template>
  <v-locale-provider>
    <v-app :class="[website.miniSidebar ? 'mini-sidebar' : '']">
      <VerticalSidebar />
      <VerticalHeader />
      <v-main>
        <v-container fluid class="page-wrapper">
          <div>
            <RouterView />
          </div>
        </v-container>
        <v-container fluid class="pt-0">
          <div>
            <FooterPanel />
          </div>
        </v-container>
      </v-main>
    </v-app>
  </v-locale-provider>
</template>
