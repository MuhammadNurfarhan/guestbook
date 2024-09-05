<template>
  <v-app>

    <!-- App Bar with Hamburger Icon -->
    <v-app-bar app>
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title>Guest Book</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn prepend-icon="mdi-account" variant="tonal" class="mr-2" rounded readonly>{{ authStore.user }}</v-btn>
      <v-btn prepend-icon="mdi-logout" variant="outlined" @click="logout">Logout</v-btn>
    </v-app-bar>

    <!-- Navigation Drawer -->
    <v-navigation-drawer v-model="drawer" app>
      <!-- Logo Section -->
      <img
        src="@/assets/logo.png"
        alt="Logo"
        width="80"
        class="mx-auto d-flex mt-4"
      />

      <!-- Sidebar Items -->
      <v-list dense>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Main Content -->
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAuthStore } from '../stores/authStore';

interface Item {
  title: string;
  to: string;
  icon?: string;
  children?: Item[];
}

const drawer = ref(false); // Controls the drawer visibility
const mini = ref(false); // For mini-variant of the drawer
const authStore = useAuthStore();

const items = ref<Item[]>([
  { title: 'Dashboard', to: '/dashboard', icon: 'mdi-view-dashboard' },
  { title: 'Master', to: '/master', icon: 'mdi-database-edit', },
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
