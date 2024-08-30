<template>
  <v-app>
    <v-navigation-drawer app>
      <v-list>
        <v-list-item-group>
          <v-list-item v-for="item in items" :key="item.title" :to="item.to" link>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app>
      <v-toolbar-title >Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>mdi-account-circle</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    const items = [
      { title: 'Dashboard', to: '/' },
      { title: 'Master', to: '/master' },
      { title: 'Transaksi', to: '/transaksi' },
      { title: 'Report', to: '/report' },
      { title: 'Setting', to: '/setting' },
    ];

    return { items };
  },
});
</script>

<style scoped>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
