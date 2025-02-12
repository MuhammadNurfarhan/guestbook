<script setup lang="ts">
import { getVisitAPI, updateVisitAPI } from '@/api/visit/visit';
import QrScannerDialog from './components/QrScannerDialog.vue';
import { useLoading } from '@/hooks';
import { ElMessage, ElMessageBox } from 'element-plus';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders: any = [
  { title: 'Checkin', key: 'check_in', sortable: false },
  { title: 'Checkout', key: 'check_out', sortable: false },
  { title: 'Visit Number', key: 'visit_no', sortable: true },
  { title: 'Visitor Name', key: 'visit_name', sortable: true },
  { title: 'Vehicle Type', key: 'vehicle_name', sortable: true },
  { title: 'Police Number', key: 'vehicle_no', sortable: false },
  { title: 'Driver Name', key: 'driver_name', sortable: true },
  { title: 'ID Type', key: 'identitas_name', sortable: true },
  { title: 'ID Number', key: 'identitas_no', sortable: true },
  { title: 'Destination Building', key: 'destinate_name', sortable: true },
  { title: 'Destination PIC', key: 'destinate_pic', sortable: true },
  { title: 'Vendor Name', key: 'vendor_name', sortable: true },
  { title: 'Visitor Purpose', key: 'purpose_name', sortable: true },
  { title: 'Visitor Count', key: 'visitor_count', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Status', key: 'status', sortable: true },
  { title: 'Remarks', key: 'remarks', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
];

const state = reactive({
  tableData: [],
  search: '',
  showDialog: false,
  showQRScanner: false,
  dialogAction: {
    type: "create",
    data: {},
  },
});

const getVisitList = () => {
  showLoading();
  getVisitAPI(new Date()).then((res) => {
    if (res.data) {
      state.tableData = res.data;
    }
    hideLoading();
  }).catch(() => {
    hideLoading();
  });
};

const handleCreateClick = () => {
  state.dialogAction.type = "create";
  state.dialogAction.data = null;
  state.showDialog = true;
};

const handleEditClick = (item: any) => {
  state.dialogAction.type = "update";
  state.dialogAction.data = item;
  state.showDialog = true;
};

const checkoutVisitor = (item: any) => {
  ElMessageBox.confirm(
    'Are you sure you want to checkout this visitor?',
    'Checkout Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(() => {
    const updatedItem = { ...item, check_out: new Date().toISOString(), status: 'Check out' };
    updateVisitAPI(updatedItem).then(() => {
      getVisitList();
    });
  });
};

const handleDialogClose = () => {
  state.showDialog = false;
  getVisitList();
};

const handleOpenScanQR = () => {
  state.showQRScanner = true;
};

const handleScanQRClose = () => {
  state.showQRScanner = false;
  getVisitList();
};

// QR code scanning result handler
const handleScanQR = (result: string) => {
  const visitId = result;  // Assuming the scanned QR code contains the visit_id
  const visitToCheckout = state.tableData.find(item => item.visit_id === visitId);
  if (visitToCheckout) {
    const visitToCheckout = { visit_id: visitId };
    updateVisitAPI(visitToCheckout).then(() => {
      getVisitList();
    });
    state.showQRScanner = false;
    ElMessage.success('Visitor checked out successfully');
  } else {
    ElMessageBox.alert('Visit not found!');
  }
};

onBeforeMount(() => {
  getVisitList();
});
</script>

<template>
  <ParentCard title="Visits" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-row>
          <v-col cols="7">
            <span class="text-h5">Visit List</span>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-text-field
              v-model="state.search"
              label="Search"
              color="primary"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
            />
          </v-col>
          <v-col cols="1">
            <v-btn color="primary" @click="handleCreateClick" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-col>
          <v-col cols="1">
            <v-btn color="success" @click="handleOpenScanQR" prepend-icon="mdi-qrcode">
              Scan QR
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="state.tableData"
        :search="state.search"
        loading-text="Loading user data..."
        style="overflow-x: auto; white-space: nowrap"
      >
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status === 'Check in' ? 'primary' : 'success'"
            text-color="white"
            variant="elevated"
            class="rounded-pill"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <td>
              <v-icon color="primary" @click="handleEditClick(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon color="success" @click="checkoutVisitor(item)" v-if="item.status === 'Check in'">
                mdi-check-circle
              </v-icon>
            </td>
        </template>
      </v-data-table>
    </v-card>

    <QrScannerDialog
      :showQRScanner="state.showQRScanner"
      @qrScanned="handleScanQR"
      @close="handleScanQRClose"
    />

    <VisitDialog
      v-if="state.showDialog"
      :showDialog="state.showDialog"
      :action="state.dialogAction"
      @close="handleDialogClose"
    />
  </ParentCard>
</template>

<style lang="scss"></style>
