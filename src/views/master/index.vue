<template>
  <v-container>
    <v-card class="mb-4">
      <v-card-title class="text-h5 d-flex align-center">
        <v-icon large color="primary" class="mr-2">mdi-database</v-icon>
        Master Data Management
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6" md="4" v-for="link in links" :key="link.title">
            <v-hover v-slot="{ isHovering, props }">
              <v-card
                v-bind="props"
                :elevation="isHovering ? 8 : 2"
                :class="{ 'on-hover': isHovering }"
                @click="navigateTo(link.to)"
              >
                <v-card-title class="text-subtitle-1">
                  <v-icon :color="link.color" class="mr-2">{{ link.icon }}</v-icon>
                  {{ link.title }}
                </v-card-title>
                <v-card-subtitle>{{ link.description }}</v-card-subtitle>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

interface Link {
  title: string;
  to: string;
  icon: string;
  color: string;
  description: string;
}

const router = useRouter();

const links = ref<Link[]>([
  {
    title: 'Master Vendor',
    to: '/master/vendor',
    icon: 'mdi-truck-delivery',
    color: 'blue',
    description: 'Manage vendor information and details'
  },
  {
    title: 'Master Vehicle Type',
    to: '/master/vehicle-type',
    icon: 'mdi-car-multiple',
    color: 'green',
    description: 'Configure different types of vehicles'
  },
  {
    title: 'Master Identity Type',
    to: '/master/identity-type',
    icon: 'mdi-card-account-details',
    color: 'red',
    description: 'Set up various identity types for verification'
  },
  {
    title: 'Master Destination Building',
    to: '/master/destination-building',
    icon: 'mdi-office-building',
    color: 'orange',
    description: 'Manage building destinations within the facility'
  },
  {
    title: 'Master Visitor Purpose',
    to: '/master/visitor-purpose',
    icon: 'mdi-clipboard-text',
    color: 'purple',
    description: 'Define different purposes for visitor entries'
  },
]);

const navigateTo = (route: string) => {
  router.push(route);
};
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}

.on-hover {
  transition: all 0.3s ease-in-out;
}
</style>
