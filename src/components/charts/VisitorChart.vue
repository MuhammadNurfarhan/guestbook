<script lang="ts">
import { ref, onMounted, defineComponent } from 'vue';
import * as echarts from 'echarts';
import { getVisitAPI } from '@/api/visit/visit';

export default defineComponent({
  name: 'VisitorChart',
  setup() {
    const chartRef = ref(null);
    let chartInstance: echarts.ECharts | null = null;

    // Fetch visitor data from API
    const fetchVisitorData = async () => {
      try {
        const res = await getVisitAPI(new Date());
        const data = res?.data || [];

        if (data.length === 0) {
          console.warn('No visitor data available');
          if (chartInstance) {
            chartInstance.clear();
          }
          return;
        }

        const dates = data.map((item: any) => item.check_in || 'Unknown Date');
        const totalVisitors = data.map((item: any) => item.visitor_count || 0);

        // Configure chart options for line chart
        const chartOptions = {
          title: {
            text: 'Total Visitors Over Time',
            left: 'center',
          },
          tooltip: {
            trigger: 'axis',
          },
          xAxis: {
            type: 'category',
            data: dates,
          },
          yAxis: {
            type: 'value',
          },
          series: [
            {
              name: 'Total Visitors',
              type: 'line',
              data: totalVisitors,
              smooth: true,
              lineStyle: {
                color: '#5470C6',
              },
            },
          ],
        };

        if (chartInstance) {
          chartInstance.setOption(chartOptions);
        }
      } catch (error) {
        console.error('Failed to fetch visitor data:', error);
        if (chartInstance) {
          chartInstance.clear();
        }
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartInstance = echarts.init(chartRef.value);
        fetchVisitorData();
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
  <div ref="chartRef" style="width: 100%; height: 400px;"></div>
</template>

<style scoped>
/* Optional custom styles */
</style>
