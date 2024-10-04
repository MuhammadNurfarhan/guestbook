<script lang="ts" setup>
import { useRouteStore } from "@/stores/modules/route";
import { useWebsiteStore } from "@/stores/modules/website";

const website = useWebsiteStore();
const routes = useRouteStore();
</script>

<template>
  <v-navigation-drawer
    v-model="website.sidebarDrawer"
    left
    elevation="0"
    rail-width="75"
    mobile-breakpoint="lg"
    app
    class="leftSidebar"
    :rail="website.miniSidebar"
    expand-on-hover
  >
    <!---Logo part -->
    <div class="logoPadding">
      <LogoMain />
    </div>
    <!-- ---------------------------------------------- -->
    <!---Navigation -->
    <!-- ---------------------------------------------- -->
    <perfect-scrollbar class="scrollnavbar">
      <v-list class="pa-2">
        <!---Menu Loop -->
        <template v-for="(item, i) in routes.routes" :key="i">
          <template v-if="!item.meta?.hidden">
            <!---Single Item-->
            <NavItem
              v-if="!item.meta || !item.children"
              :item="item"
              class="leftPadding"
            />
            <!---If Has Child -->
            <NavCollapse v-else :item="item" :level="0" class="leftPadding" />
          </template>
        </template>
      </v-list>
    </perfect-scrollbar>
  </v-navigation-drawer>
</template>

<style lang="scss"></style>
