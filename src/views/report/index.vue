<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { useLoading } from '@/hooks';

// Period options
const periods = ['Daily', 'Weekly', 'Monthly', 'Yearly'];
const selectedPeriod = ref('Daily');
const selectedDate = ref<Date | null>(null); // The base date to calculate the period
const reportData = ref<any[]>([]);
const menu = ref(false);
const form = ref(null);
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Visitor NO', key: 'visit_no', sortable: true },
  { title: 'Visitor Name', key: 'visitor_name', sortable: true },
  { title: 'Date', key: 'created_date', sortable: true },
  { title: 'Check-In Time', key: 'check_in', sortable: true },
  { title: 'Check-Out Time', key: 'check_out', sortable: true },
];

// Max date for date picker (today)
const maxDate = computed(() => new Date().toISOString().substr(0, 10));

// Function to calculate the start and end date based on the selected period
const calculateDateRange = (period: string, baseDate: string) => {
  const date = new Date(baseDate);

  // Validate if date is valid
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date format');
  }

  let startDate, endDate;

  switch (period) {
    case 'Daily':
      startDate = new Date(date);
      endDate = new Date(date);
      break;
    case 'Weekly':
      startDate = new Date(date.setDate(date.getDate() - date.getDay())); // Start of the week (Sunday)
      endDate = new Date(date.setDate(startDate.getDate() + 6)); // End of the week (Saturday)
      break;
    case 'Monthly':
      startDate = new Date(date.getFullYear(), date.getMonth(), 1); // Start of the month
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0); // End of the month
      break;
    case 'Yearly':
      startDate = new Date(date.getFullYear(), 0, 1); // Start of the year
      endDate = new Date(date.getFullYear(), 11, 31); // End of the year
      break;
  }

  return { startDate, endDate };
};

// Function to fetch report data
const getReport = async () => {
  // Validate the form
  if (!(form.value as any).validate()) return;

  // Check if date is provided
  if (!selectedDate.value) {
    ElMessage.error('Please select a date');
    return;
  }

  showLoading();

  try {
    // Calculate date range based on selected period and date
    const { startDate, endDate } = calculateDateRange(selectedPeriod.value, selectedDate.value.toISOString());

    // Format dates for API query
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];

    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/visit`, {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
    });

    reportData.value = response.data;
    ElMessage.success('Report generated successfully');
  } catch (error) {
    console.error('Error fetching report data:', error);
    ElMessage.error('Failed to generate report. Please try again.');
  } finally {
    hideLoading();
  }
};

// Function to export data to Excel
const exportToExcel = () => {
  if (!reportData.value.length) {
    ElMessage.warning('No data to export');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(reportData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Report');

  XLSX.writeFile(workbook, `Visitor_Report_${selectedPeriod.value}_${selectedDate.value}.xlsx`);
  ElMessage.success('Report exported successfully');
};

// Function to reset the form
const resetForm = () => {
  selectedPeriod.value = 'Daily';
  selectedDate.value = null;
  reportData.value = [];
  (form.value as any)?.reset();
};
</script>

<template>
  <Parent-card title="Report">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center text-h4">
        <span>Visitor Report</span>
        <v-btn @click="resetForm" color="secondary" small>Reset</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="getReport" ref="form">
          <v-row>
            <v-col cols="12" sm="4">
              <v-select
                v-model="selectedPeriod"
                :items="periods"
                label="Select Period"
                :rules="[v => !!v || 'Period is required']"
                required
              ></v-select>
            </v-col>
            <v-col cols="12" sm="4">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                target="['bottom', 'start']"
                min-width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
                    v-bind="props"
                    v-model="selectedDate"
                    label="Select Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    :rules="[v => !!v || 'Date is required']"
                    required
                  ></v-text-field>
                </template>

                <v-date-picker
                  v-model="selectedDate"
                  @input="menu = false"
                  :max="maxDate"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center">
              <v-btn
                type="submit"
                color="primary"
                class="mr-4"
                :loading="loading"
                :disabled="loading"
              >
                Generate Report
              </v-btn>
              <v-btn
                @click="exportToExcel"
                color="success"
                :disabled="!reportData.length || loading"
              >
                Export to Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-data-table
          :headers="tableHeaders"
          :items="reportData"
          :loading="loading"
          class="mt-5"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
  </Parent-card>
</template>
