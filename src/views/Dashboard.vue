// Dashboard.vue
<template>
  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-card-title class="bg-success mb-2">Total Visitors</v-card-title>
          <v-card-text>
            <VisitorChart />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import VisitorChart from '../components/VisitorChart.vue';

export default defineComponent({
  name: 'Dashboard',
  components: {
    VisitorChart,
  },
});
</script>
