<script setup lang="ts">
import { getVendorAPI, deleteVendorAPI } from '@/api/master/masterVendor';
import { useLoading } from '../../hooks';
import { ElMessageBox } from 'element-plus';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders: any = [
  { title: 'Vendor Name', key: 'vendor_name' },
  { title: 'Description', key: 'vendor_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const state = reactive({
  tableData: null,
  showDialog: false,
  dialogAction: {
    type: "create",
    data: {},
  },
});

const getVendorList = () => {
  showLoading();
  getVendorAPI().then((res) => {
    state.tableData = res.data;
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
    'Are you sure you want to delete this vendor?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
  }).then(() => {
    deleteVendorAPI(item).then(() => {
      getVendorList();
    });
  });
};

const handleDialogClose = () => {
  state.showDialog = false;
  getVendorList();
};

onBeforeMount(() => {
  getVendorList();
});
</script>

<template>
  <ParentCard title="Vendors" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Vendor List</span>
        <v-btn color="primary" @click="handleCreateClick" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="state.tableData"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon small @click="handleEditClick(item)" class="mr-2" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon small @click="handleDeleteClick(item)" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <VendorDialog
      v-if="state.showDialog"
      :showDialog="state.showDialog"
      :action="state.dialogAction"
      @cancel="handleDialogClose"
    />
  </ParentCard>
</template>
