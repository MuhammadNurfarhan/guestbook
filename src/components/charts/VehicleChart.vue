<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import * as echarts from 'echarts';
import { getVehicleAPI } from '@/api/master/masterVehicle';

export default defineComponent({
  name: 'VehicleChart',
  setup() {
    const chartRef = ref(null);
    let chartInstance: echarts.ECharts | null = null;

    // Fetch vehicle data from API
    const fetchVehicleData = async () => {
      try {
        const res = await getVehicleAPI();
        const data = res?.data || [];

        if (data.length === 0) {
          console.warn('No vehicle data available');
          // Optionally, clear the chart or show a message
          if (chartInstance) {
            chartInstance.clear();
          }
          return;
        }

        const vehicleNames = data.map((item: any) => item.vehicle_name);
        const vehicleValues = data.map((item: any) => item.vehicle_desc.length);

        // Configure chart options for bar chart
        const chartOptions = {
          title: {
            text: 'Vehicle Distribution',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow',
            },
          },
          xAxis: {
            type: 'category',
            data: vehicleNames,
            axisLabel: {
              rotate: 45,
              margin: 10,
            },
          },
          yAxis: {
            type: 'value',
            min: 0,
            axisLabel: {
              formatter: '{value}',
            },
          },
          series: [
            {
              name: 'Count',
              type: 'bar',
              data: vehicleValues,
              itemStyle: {
                color: '#73C0DE',
              },
            },
          ],
        };

        if (chartInstance) {
          chartInstance.setOption(chartOptions);
        }
      } catch (error) {
        console.error('Failed to fetch vehicle data:', error);
        if (chartInstance) {
          chartInstance.clear();
        }
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        fetchVehicleData();
      }

      window.addEventListener('resize', () => {
        chartInstance?.resize();
      });
    });

    return { chartRef };
  },
});
</script>

<template>
  <div ref="chartRef" style="height: 400px;"></div>
</template>

<style scoped>
/* Optional custom styles */
</style>
