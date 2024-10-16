<script setup lang="ts">
import * as XLSX from 'xlsx';
import { ElMessage } from 'element-plus';
import { useLoading } from '@/hooks';
import { getVisitReportAPI } from '@/api/report/report';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders: any = [
  { title: 'Visitor NO', key: 'visit_no', sortable: true },
  { title: 'Visitor Name', key: 'visit_name', sortable: true },
  { title: 'Date', key: 'created_date', sortable: true },
  { title: 'Check-In Time', key: 'check_in', sortable: true },
  { title: 'Check-Out Time', key: 'check_out', sortable: true },
];

const exportHeaders = [
  'visit_no',
  'visit_name',
  'created_date',
  'check_in',
  'check_out',
  'destinate_pic',
  'driver_name',
  'destinate_name',
  'purpose_name',
  'identitas_name',
  'identitas_no',
  'vehicle_name',
  'vendor_name',
  'vehicle_no',
  'remarks',
  'email',
  'status'
];

const state = reactive({
  form: null,
  From_date: null,
  To_date: null,
  reportData: [],
  menu: false,
});

const formattedReportData = computed(() =>
  state.reportData.map((item) => ({
    ...item,
    created_date: new Date(item.created_date).toLocaleDateString('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }), // Format to YYYY-MM-DD
  }))
);

// Max date for date picker (today)
const maxDate = computed(() => new Date().toISOString().substr(0, 10));

const filterReportDataForExport = () => {
  return state.reportData.map(item =>
    exportHeaders.reduce((acc: any, key: any) => {
      acc[key] = item[key]; // Include only the fields defined in exportHeaders
      return acc;
    }, {})
  );
};

const getReport = async () => {
  if (!state.From_date || !state.To_date) {
    ElMessage.error('Please select both start and end dates.');
    return;
  }

  showLoading();
  await new Promise((resolve) => setTimeout(resolve, 1000));

  try {
    const formattedFrom_date = new Date(state.From_date).toISOString().split('T')[0];
    const formattedTo_date = new Date(state.To_date).toISOString().split('T')[0];

    const res = await getVisitReportAPI(formattedFrom_date, formattedTo_date);
    if (res.data) {
      state.reportData = res.data;
    }
    hideLoading();
  } catch (error) {
    hideLoading();
    ElMessage.error('Failed to generate report. Please try again.');
  }
};

const exportToExcel = () => {
  if (!state.reportData.length) {
    ElMessage.warning('No data to export');
    return;
  }

  const filteredData = filterReportDataForExport();
  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Visitor Report');

  XLSX.writeFile(workbook, `Visitor_Report.xlsx`);
  ElMessage.success('Report exported successfully');
};

</script>

<template>
  <Parent-card title="Report">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center text-h4">
        <span>Visitor Report</span>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="getReport" ref="form">
          <v-row>
            <v-col cols="12" sm="4">
              <v-date-input
                v-model="state.From_date"
                :max="maxDate"
                label="Start Date"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-date-input
                v-model="state.To_date"
                :max="maxDate"
                label="End Date"
                variant="outlined"
                color="primary"
                required
              />
            </v-col>
            <v-col cols="12" sm="4" class="d-flex align-center justify-end mb-5">
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
                :disabled="!state.reportData.length || loading"
              >
                Export to Excel
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-data-table
          :headers="tableHeaders"
          :items="formattedReportData"
          :loading="loading"
          class="mt-5"
        />
      </v-card-text>
    </v-card>
  </Parent-card>
</template>
