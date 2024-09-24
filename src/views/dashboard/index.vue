<template>
  <v-container fluid>
    <h1>Dashboard</h1>
    <v-row>
      <v-col cols="12">
        <v-card>
          <visitor-chart />
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-5">
      <v-col cols="12" md="6">
        <v-card>
          <vendor-chart />
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card>
          <vehicle-chart />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VendorChart from '@/components/VendorChart.vue';
import VisitorChart from '@/components/VisitorChart.vue';
import VehicleChart from '@/components/VehicleChart.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    VendorChart,
    VisitorChart,
    VehicleChart,
  },
});
</script>
