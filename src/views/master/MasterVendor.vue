<template>
  <v-container>
    <div class="mt-5">
      <v-btn variant="outlined" @click="backMaster">
        <v-icon icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
      <v-card-title>
        <span class="text-h5">Vendor List</span>
        <div class="float-right">
          <v-btn color="primary" @click="showDialog = true">Create</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="vendors"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.vendor_name }}</td>
              <td>{{ item.vendor_desc }}</td>
              <td>
                <v-btn icon @click="deleteVendor(item.vendor_id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </div>

    <!-- Vendor Dialog -->
    <AddVendorDialog
      v-model:show="showDialog"
      @save="addVendor"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
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

// Table headers
const tableHeaders = [
  { title: 'Vendor Name', value: 'vendor_name' },
  { title: 'Description', value: 'vendor_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch vendors from API
const getVendors = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor`);
    vendors.value = response.data.data;
  } catch (error) {
    console.error('Error fetching vendors:', error);
  }
};

// Add vendor function
const addVendor = async (vendorData: { vendor_name: string; vendor_desc: string }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor`, vendorData);
    await getVendors();
    showDialog.value = false;
    alert('Vendor added successfully!');
  } catch (error) {
    console.error('Error adding vendor:', error);
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
};

// Delete vendor function
const deleteVendor = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/vendor/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getVendors(); // Refresh the vendor list after deletion
  } catch (error) {
    console.error('Error deleting vendor:', error);
  }
};

// Go back to master page
const backMaster = () => {
  router.push('/master');
};

// Fetch vendors on mount
onMounted(getVendors);

</script>
