<template>
  <div>
    <Line :data="chartData" :options="chartOptions" />
  </div>
</template>

<script  lang="ts">
import { ref, onMounted, defineComponent,  } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}

export default defineComponent({
  name: 'VisitorChart',
  components: { Line },
  setup() {

    const chartData = ref<ChartData>({
      labels: [],
      datasets: [
        {
          label: 'Total Visitors',
          data: [],
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    });

    const chartOptions = ref({
          responsive: true,
          maintainAspectRatio: false,
    });

    // get visitor data from API
    // const fetchVisitorData = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:3000/visitors'); // Your API endpoint
    //     const data = response.data;

    //     chartData.value.labels = data.map((item: any) => item.date);
    //     chartData.value.datasets[0].data = data.map((item: any) => item.totalVisitors);
    //   } catch (error) {
    //     console.error('Failed to fetch visitor data:', error);
    //   }
    // };

    const fetchVisitorData = () => {
      try {
        const data = [
          { date: '2024-08-01', totalVisitors: 150 },
          { date: '2024-08-02', totalVisitors: 200 },
          { date: '2024-08-03', totalVisitors: 175 },
          { date: '2024-08-04', totalVisitors: 225 },
          { date: '2024-08-05', totalVisitors: 250 },
        ];
        chartData.value.labels = data.map((item: any) => item.date);
        chartData.value.datasets[0].data = data.map((item: any) => item.totalVisitors);

        // Store the chart data and options in localStorage
        localStorage.setItem('chartData', JSON.stringify(chartData.value));
        localStorage.setItem('chartOptions', JSON.stringify(chartOptions.value));
      } catch (error) {
        console.error('failed to fetch visitor data', error);
      }
    };

    // Retrieve the chart data and options from localStorage
    const storedChartData = localStorage.getItem('chartData');
    const storedChartOptions = localStorage.getItem('chartOptions');

    if (storedChartData && storedChartOptions) {
      chartData.value = JSON.parse(storedChartData);
      chartOptions.value = JSON.parse(storedChartOptions);
    } else {
      fetchVisitorData();
    }

    onMounted(() => {
      fetchVisitorData();
    });

    return { chartData, chartOptions, fetchVisitorData };
  },

});


</script>

<style scoped>
/* Add your custom styles here */
</style>
