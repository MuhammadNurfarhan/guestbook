<template>
  <div>
    <div ref="chartRef" style="height: 400px;"></div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import * as echarts from 'echarts';
import axios from 'axios';

export default defineComponent({
  name: 'VendorChart',
  setup() {
    const chartRef = ref(null);
    let chartInstance: echarts.ECharts | null = null;

    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor`); // API endpoint
        const data = response.data.data;

        const vendorNames = data.map((vendor: any) => vendor.vendor_name);

        // Configure chart options for pie chart
        const chartOptions = {
          title: {
            text: 'Vendor Distribution',
            left: 'center',
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {d}%', // Tooltip to show percentage
          },
          series: [
            {
              name: 'Vendors',
              type: 'pie',
              radius: '50%',
              data: vendorNames.map((name: string) => ({
                name,
                value: 1, // Each vendor gets equal weight, as no count is available
              })),
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)',
                },
              },
            },
          ],
        };

        if (chartInstance) {
          chartInstance.setOption(chartOptions);
        }
      } catch (error) {
        console.error('Failed to fetch vendor data:', error);
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        fetchVendorData();
      }

      window.addEventListener('resize', () => {
        chartInstance?.resize();
      });
    });

    return { chartRef };
  },
});
</script>

<style scoped>
/* Optional custom styles */
</style>
