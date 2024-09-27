<script lang="ts" setup>
import { useWebsiteStore } from "@/stores/modules/website";
import { useAuthStore } from "@/stores/modules/authStore";

const website = useWebsiteStore();
const authStore = useAuthStore();

const logout = () => {
  authStore.logout();
};
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
    <v-btn prepend-icon="mdi-account" variant="tonal" class="mr-2" rounded readonly>{{ authStore.role }}</v-btn>
    <v-btn prepend-icon="mdi-logout" variant="outlined" @click="logout">Logout</v-btn>
  </v-app-bar>
</template>
