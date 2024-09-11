<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="text-h5">
        Master Data Management
      </v-card-title>
      <v-card-text class="">
        <v-list>
          <v-list-item
            v-for="link in links"
            :key="link.title"
            :to="link.to"
          >
            <v-list-item-title>{{ link.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const links = ref([
  { title: 'Master Vendor', to: '/master/vendor' },
  { title: 'Master Vehicle Type', to: '/master/vehicle-type' },
  { title: 'Master Identity Type', to: '/master/identity-type' },
  { title: 'Master Destination Building', to: '/master/destination-building' },
  { title: 'Master Visitor Purpose', to: '/master/visitor-purpose' },
]);
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
