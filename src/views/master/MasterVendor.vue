<template>
  <v-container>
    <!-- Add Vendor Form -->
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Vendor</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="Vendor_name"
            :rules="[rules.required]"
            label="Vendor Name"
            variant="outlined"
            class="mb-2"
            ref="vendorNameField"
            required
          ></v-text-field>
          <v-textarea
            v-model="Vendor_desc"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addVendor" class="mr-4">Add Vendor</v-btn>
          <v-btn variant="outlined" @click="backMaster">Back</v-btn>
        </v-form>
      </v-card-text>
    </v-card>

    <!-- Vendors Table -->
    <v-card class="mt-5">
      <v-card-title>
        <span class="text-h5">Vendor List</span>
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
                <v-btn icon @click="editVendor(item)">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="deleteVendor(item.id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

interface Vendor {
  id: number;
  vendor_name: string;
  vendor_desc: string;
}

const valid = ref(false);
const Vendor_name = ref('');
const Vendor_desc = ref('');
const vendors = ref<Vendor[]>([]); // Holds the list of vendors
const router = useRouter();

// Ref for the Vendor Name field
const vendorNameField = ref(null);

// Table headers
const tableHeaders = [
  { title: 'Vendor Name', value: 'vendor_name' },
  { title: 'Description', value: 'vendor_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add vendor
const addVendor = async () => {
  if (valid.value) {
    try {
      const payload = {
        vendor_name: Vendor_name.value,
        vendor_desc: Vendor_desc.value
      };
      console.log('Payload sent to backend:', payload);

      // Send data to backend
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vendor`, payload);

      // Fetch updated vendor list
      await getVendors();

      // Clear form
      Vendor_name.value = '';
      Vendor_desc.value = '';
      valid.value = false;
      alert('Vendor added successfully!');

      // Set focus back to vendor name field
      await nextTick();
      if (vendorNameField.value) {
        (vendorNameField.value as HTMLInputElement).focus();
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  } else {
    alert('Please fill in the required fields.');
  }
};

// Method to fetch vendor data from backend
const getVendors = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor`);
    vendors.value = response.data.data; // Assign data to vendors array
  } catch (error) {
    console.error('Error fetching vendors:', error);
  }
};

// Call fetchVendors when the component is mounted
onMounted(async () => {
  await getVendors();
});

// Method to edit vendor
const editVendor = (vendors: any) => {
  console.log('Edit vendor:', vendors);
  // Implement editing logic here
};

// Method to delete vendor
const deleteVendor = async (id: number) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/vendor/${id}`);
    // Fetch updated vendor list after deletion
    await getVendors();
  } catch (error) {
    console.error('Error deleting vendor:', error);
  }
};

const backMaster = () => {
  router.push('/master');
};
</script>
