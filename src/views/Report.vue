<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Visitor Report</span>
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="4">
              <v-select
                v-model="selectedPeriod"
                :items="periods"
                label="Select Period"
              ></v-select>
            </v-col>
            <v-col cols="4">
              <v-menu
                v-model="menu"
                :close-on-content-click="false"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ attrs }">
                  <v-text-field
                    v-model="selectedDate"
                    label="Select Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="selectedDate"
                  @input="menu = false"
                  :max="new Date().toISOString().substr(0, 10)"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4">
              <v-btn @click="fetchReportData" color="primary"  class="mr-4">Generate Report</v-btn>
              <v-btn @click="exportToExcel" color="success">Export to Excel</v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-data-table :headers="tableHeaders" :items="reportData" class="mt-5"></v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

// Period options (week/month/year)
const periods = ['Weekly', 'Monthly', 'Yearly'];
const selectedPeriod = ref('Weekly');
const selectedDate = ref('');
const reportData = ref<any[]>([]);
const tableHeaders = [
  { text: 'Visitor ID', value: 'visitor_id' },
  { text: 'Visitor Name', value: 'visitor_name' },
  { text: 'Date', value: 'date' },
  { text: 'Check-In Time', value: 'check_in' },
  { text: 'Check-Out Time', value: 'check_out' },
];
const menu = ref(false);

// Fetch data from the backend for the selected period
const fetchReportData = async () => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/visitor-report`, {
        params: {
          period: selectedPeriod.value,
          date: selectedDate.value,
        }
      }
    );
    reportData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching report data:', error);
  }
};

// Export report data to Excel
const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(reportData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Report');

  // Trigger file download
  XLSX.writeFile(workbook, 'Visitor_Report.xlsx');
};
</script>
