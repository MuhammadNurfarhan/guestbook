<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn variant="outlined" @click="backMaster" prepend-icon="mdi-arrow-left" class="mb-4">
          Back
        </v-btn>
      </v-col>
    </v-row>

    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Vendor List</span>
        <v-btn color="primary" @click="showDialog = true" prepend-icon="mdi-plus">
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
    <AddVendorDialog
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
        <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddVendorDialog from './components/AddVendorDialog.vue';

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  vendor_desc: string;
}

const showDialog = ref(false);
const vendors = ref<Vendor[]>([]);
const router = useRouter();
const loading = ref(false);
const editMode = ref(false);
const editedVendor = ref<Vendor | null>(null);
const deleteDialog = ref(false);
const deleting = ref(false);
const snackbar = ref({ show: false, text: '', color: 'success' });

const tableHeaders = [
  { title: 'Vendor Name', key: 'vendor_name' },
  { title: 'Description', key: 'vendor_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getVendors = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor`);
    vendors.value = response.data.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    showSnackbar('Failed to fetch vendors', 'error');
  } finally {
    loading.value = false;
  }
};

const saveVendor = async (vendorData: Vendor) => {
  try {
    if (editMode.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/vendor/${vendorData.vendor_id}`, vendorData);
      showSnackbar('Vendor updated successfully!', 'success');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor`, vendorData);
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
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/vendor/${editedVendor.value.vendor_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
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

const backMaster = () => {
  router.push('/master');
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(getVendors);
</script>
