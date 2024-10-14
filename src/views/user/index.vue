<script setup lang="ts">
import { getUserAPI, deleteUserAPI } from '@/api/user/user';
import { useLoading } from '../../hooks';
import { ElMessageBox } from 'element-plus';

const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = ref([
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Email', key: 'email', sortable: true },
  { title: 'Role', key: 'role', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false },
]);

const state = reactive({
  tableData: [],
  search: '',
  showDialog: false,
  dialogAction: {
    type: "create",
    data: {},
  },
});

const getUserList = () => {
  showLoading();
  getUserAPI(new Date()).then((res) => {
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
    'Are you sure you want to delete this user?',
    'Delete Confirmation',
    {
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      type: 'warning',
  }).then(() => {
    deleteUserAPI(item).then(() => {
      getUserList();
    });
  });
};

const handleDialogClose = () => {
  state.showDialog = false;
  getUserList();
};

onMounted(() => {
  getUserList();
});

onBeforeMount(() => {
  getUserList();
});
</script>

<template>
  <ParentCard title="User Management" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <v-row>
          <v-col cols="8">
            <span class="text-h5">User List</span>
          </v-col>
          <v-col cols="3" class="text-right">
            <v-text-field v-model="state.search" label="Search" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify" hide-details single-line />
          </v-col>
          <v-col cols="1">
            <v-btn color="primary" @click="handleCreateClick" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="state.tableData"
        :search="state.search"
        :loading="loading"
        loading-text="Loading user data..."
        style="overflow-x: auto; white-space: nowrap"
      >
        <template v-slot:[`item.status`]="{ item }">
          <v-chip
            :color="item.status === 'Check in' ? 'success' : 'error'"
            text-color="white"
            class="rounded-pill"
          >
            {{ item.status }}
          </v-chip>
        </template>

        <template v-slot:[`item.actions`]="{ item }">
            <td>
              <v-icon color="primary" @click="handleEditClick(item)" class="mr-2">mdi-pencil</v-icon>
              <v-icon color="error" @click="handleDeleteClick(item)" class="mr-2">mdi-delete</v-icon>
            </td>
        </template>
      </v-data-table>
    </v-card>

    <VisitDialog
      v-if="state.showDialog"
      :showDialog="state.showDialog"
      :action="state.dialogAction"
      @close="handleDialogClose"
    />
  </ParentCard>
</template>

<style lang="scss"></style>
