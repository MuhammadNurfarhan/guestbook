<script lang="ts" setup>
import { useWebsiteStore } from "@/stores/modules/website";

const website = useWebsiteStore();
</script>

<template>
  <v-app-bar elevation="0" height="80">
    <v-btn
      class="hidden-md-and-down text-secondary"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      @click.stop="website.setMiniSidebar(!website.miniSidebar)"
    >
      <v-icon icon="mdi-menu" />
    </v-btn>
    <v-btn
      class="hidden-lg-and-up text-secondary ms-3"
      icon
      rounded="sm"
      variant="flat"
      size="small"
      @click.stop="website.setSidebarDrawer"
    >
      <v-icon icon="mdi-menu" />
    </v-btn>

    <v-spacer />

    <!-- user and logout -->
  </v-app-bar>
</template>
