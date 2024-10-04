<script lang="ts">
import { defineComponent } from 'vue';
import VendorChart from '@/components/charts/VendorChart.vue';
import VisitorChart from '@/components/charts/VisitorChart.vue';
import VehicleChart from '@/components/charts/VehicleChart.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    VendorChart,
    VisitorChart,
    VehicleChart,
  },
});
</script>

<template>
  <Parent-card title="Dashboard">
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
  </Parent-card>
</template>
