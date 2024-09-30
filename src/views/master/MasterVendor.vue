<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoading } from '../../hooks';
import { getVendorAPI, createVendorAPI, updateVendorAPI, deleteVendorAPI } from '@/api/master/masterVendor';

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  vendor_desc: string;
}

const showDialog = ref<boolean>(false);
const vendors = ref<Vendor[]>([]);
const editMode = ref<boolean>(false);
const editedVendor = ref<Vendor | null>(null);
const deleteDialog = ref(false);
const deleting = ref(false);
const snackbar = ref({ show: false, text: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Vendor Name', key: 'vendor_name' },
  { title: 'Description', key: 'vendor_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getVendors = async () => {
  showLoading();
  try {
    const response = await getVendorAPI();
    vendors.value = response.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    showSnackbar('Failed to fetch vendors', 'error');
  } finally {
    hideLoading();
  }
};

const saveVendor = async () => {
  try {
    if (editMode.value) {
      const res = await updateVendorAPI(editedVendor.value?.vendor_id);
      editedVendor.value = res.data;
      showSnackbar('Vendor updated successfully!', 'success');
    } else {
      const res = await createVendorAPI();
      editedVendor.value = res.data;
      showSnackbar('Vendor added successfully!', 'success');
    }
    await getVendors();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving vendor:', error);
    showSnackbar('Failed to save vendor', 'error');
  }
};

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedVendor.value = null;
};

const editVendor = (vendor: Vendor) => {
  editMode.value = true;
  editedVendor.value = { ...vendor };
  showDialog.value = true;
};

const confirmDeleteVendor = (vendor: Vendor) => {
  editedVendor.value = vendor;
  deleteDialog.value = true;
};

const deleteVendor = async () => {
  if (!editedVendor.value) return;

  deleting.value = true;
  try {
    const res = await deleteVendorAPI(editedVendor.value.vendor_id);
    editedVendor.value = res.data;
    await getVendors();
    deleteDialog.value = false;
    showSnackbar('Vendor deleted successfully', 'success');
  } catch (error) {
    console.error('Error deleting vendor:', error);
    showSnackbar('Failed to delete vendor', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(() => {
  getVendors();
});
</script>

<template>
  <ParentCard title="Vendors" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Vendor List</span>
        <v-btn color="primary" @click="() => { editMode = false; editedVendor = null; showDialog = true; }" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="vendors"
          :loading="loading"
          class="elevation-1"
        >
          <template v-slot:item.actions="{ item }">
            <v-btn icon small @click="editVendor(item)" class="mr-2">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn icon small @click="confirmDeleteVendor(item)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Vendor Dialog -->
    <VendorDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedVendor="editedVendor"
      @save="saveVendor"
      @cancel="handleCancel"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this vendor?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteVendor" :loading="deleting">Delete</v-btn>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </ParentCard>
</template>
