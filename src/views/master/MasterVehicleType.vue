<script setup lang="ts">
import { getVehicleAPI, deleteVehicleAPI } from '@/api/master/masterVehicle';
import { useLoading } from '../../hooks';
import { ElMessageBox } from 'element-plus';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders: any = [
  { title: 'Vehicle Name', key: 'vehicle_name' },
  { title: 'Description', key: 'vehicle_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const state = reactive({
  tableData: [],
  showDialog: false,
  dialogAction: {
    type: "create",
    data: {},
  },
});

const getVehicleList = () => {
  showLoading();
  getVehicleAPI().then((res) => {
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

const handleDeleteClick = (item: any) => {
  ElMessageBox.confirm(
    'Are you sure you want to delete this vehicle?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
  }).then(() => {
    deleteVehicleAPI(item).then(() => {
      getVehicleList();
    });
  });
};

const handleDialogClose = () => {
  state.showDialog = false;
  getVehicleList();
};

onBeforeMount(() => {
  getVehicleList();
});
</script>

<template>
  <ParentCard title="Vehicles" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Vehicle List</span>
        <v-btn color="primary" @click="handleCreateClick" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="state.tableData"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon color="primary" @click="handleEditClick(item)" class="mr-2">mdi-pencil</v-icon>
          <v-icon color="error" @click="handleDeleteClick(item)">mdi-delete</v-icon>
        </template>
      </v-data-table>
    </v-card>

    <VehicleDialog
      v-if="state.showDialog"
      :showDialog="state.showDialog"
      :action="state.dialogAction"
      @close="handleDialogClose"
    />
  </ParentCard>
</template>
