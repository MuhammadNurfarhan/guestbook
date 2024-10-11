<script setup lang="ts">
import { getIdentityAPI, deleteIdentityAPI } from '@/api/master/masterIdentity';
import { useLoading } from '../../hooks';
import { ElMessageBox } from 'element-plus';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders: any = [
  { title: 'Identity Name', key: 'identitas_name' },
  { title: 'Description', key: 'identitas_desc' },
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

const getIdentityList = () => {
  showLoading();
  getIdentityAPI().then((res) => {
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
    'Are you sure you want to delete this identity?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
  }).then(() => {
    deleteIdentityAPI(item).then(() => {
      getIdentityList();
    });
  });
};

const handleDialogClose = () => {
  state.showDialog = false;
  getIdentityList();
};

onBeforeMount(() => {
  getIdentityList();
});
</script>

<template>
  <ParentCard title="Identities" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Identity List</span>
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

    <IdentityDialog
      v-if="state.showDialog"
      :showDialog="state.showDialog"
      :action="state.dialogAction"
      @close="handleDialogClose"
    />
  </ParentCard>
</template>
