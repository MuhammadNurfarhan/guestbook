<template>
  <Parent-card title="Report">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center text-h4">
        <span>Visitor Report</span>
        <v-btn @click="resetForm" color="secondary" small>Reset</v-btn>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="fetchReportData" ref="form">
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
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template v-slot:activator="{ props }">
                  <v-text-field
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
                :loading="isLoading"
                :disabled="isLoading"
              >
                Generate Report
              </v-btn>
              <v-btn
                @click="exportToExcel"
                color="success"
                :disabled="!reportData.length || isLoading"
              >
                Export to Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-data-table
          :headers="tableHeaders"
          :items="reportData"
          :loading="isLoading"
          class="mt-5"
          :items-per-page="10"
          :footer-props="{
            'items-per-page-options': [10, 20, 50, 100, -1],
            'items-per-page-text': 'Rows per page',
          }"
        >
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </Parent-card>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import axios from 'axios';
import * as XLSX from 'xlsx';

const periods = ['Weekly', 'Monthly', 'Yearly'];
const selectedPeriod = ref('Weekly');
const selectedDate = ref('');
const reportData = ref<any[]>([]);
const tableHeaders = [
  { title: 'Visitor ID', key: 'visitor_id', sortable: true },
  { title: 'Visitor Name', key: 'visitor_name', sortable: true },
  { title: 'Date', key: 'created_date', sortable: true },
  { title: 'Check-In Time', key: 'check_in', sortable: true },
  { title: 'Check-Out Time', key: 'check_out', sortable: true },
];
const menu = ref(false);
const isLoading = ref(false);
const form = ref(null);
const snackbar = ref({ show: false, message: '', color: 'success' });

const maxDate = computed(() => new Date().toISOString().substr(0, 10));

const fetchReportData = async () => {
  if (!(form.value as any).validate()) return;

  isLoading.value = true;
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/visit`, {
        params: {
          period: selectedPeriod.value,
          created_date: selectedDate.value,
        }
      }
    );
    reportData.value = response.data.data;
    showSnackbar('Report generated successfully', 'success');
  } catch (error) {
    console.error('Error fetching report data:', error);
    showSnackbar('Failed to generate report. Please try again.', 'error');
  } finally {
    isLoading.value = false;
  }
};

const exportToExcel = () => {
  if (!reportData.value.length) {
    showSnackbar('No data to export', 'warning');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(reportData.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Report');

  XLSX.writeFile(workbook, `Visitor_Report_${selectedPeriod.value}_${selectedDate.value}.xlsx`);
  showSnackbar('Report exported successfully', 'success');
};

const resetForm = () => {
  selectedPeriod.value = 'Weekly';
  selectedDate.value = '';
  reportData.value = [];
  (form.value as any)?.reset();
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color };
};
</script>
