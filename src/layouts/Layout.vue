<template>
  <v-app>
    <v-navigation-drawer  app>
      <!-- Logo Section -->
      <img
        src="@/assets/logo.png"
        alt="Logo"
        width="80"
        class="mx-auto d-flex mt-4"
      />

      <!-- Sidebar Items -->
      <v-list>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title>Guest Book Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-account" variant="tonal" class="mr-2" rounded readonly>{{ authStore.user }}</v-btn>
      <v-btn prepend-icon="mdi-logout" variant="outlined" @click="logout">Logout</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

interface Item {
  title: string;
  to: string;
  icon: string;
}

const authStore = useAuthStore();

const items = ref<Item[]>([
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Master', to: '/master', icon: 'mdi-database-edit' },
  { title: 'Transaksi', to: '/transaksi', icon: 'mdi-cash' },
  { title: 'Report', to: '/report', icon: 'mdi-file-document' },
  { title: 'Setting', to: '/setting' , icon: 'mdi-cog'},
]);
const logout = () => {
  authStore.logout();
};

</script>

<style scoped>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
