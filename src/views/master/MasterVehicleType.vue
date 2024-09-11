<template>
  <v-container>
    <div class="mt-5">
      <v-btn variant="outlined" @click="backMaster">
        <v-icon icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
      <v-card-title>
        <span class="text-h5">Vehicle Type List</span>
        <div class="float-right">
          <v-btn color="primary" @click="showDialog = true">Create</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="vehicles"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.Vehicle_name }}</td>
              <td>{{ item.Vehicle_desc }}</td>
              <td>
                <v-btn icon @click="deleteVehicleType(item.Vehicle_id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </div>

    <!-- Dialog for adding a new vehicle type -->
    <AddVehicleDialog
      v-model:show="showDialog"
      @save="addVehicleType"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddVehicleDialog from './components/AddVehicleDialog.vue';

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_desc: string;
}

const showDialog = ref(false);
const vehicles = ref<Vehicle[]>([]);
const router = useRouter();

// Table headers
const tableHeaders = [
  { title: 'Vehicle Name', value: 'vehicle_name' },
  { title: 'Description', value: 'vehicle_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch vehicle types from API
const getVehicleTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicle`);
    vehicles.value = response.data.data;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
  }
};

// Add vehicle type function
const addVehicleType = async (vehicleData: { vehicle_name: string; vehicle_desc: string }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/vehicle`, vehicleData);
    await getVehicleTypes(); // Refresh the vehicle list after adding
    showDialog.value = false; // Close dialog after success
    alert('Vehicle type added successfully!');
  } catch (error) {
    console.error('Error adding vehicle type:', error);
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
};

// Delete vehicle type function
const deleteVehicleType = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/vehicle/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getVehicleTypes(); // Refresh the vehicle list after deletion
  } catch (error) {
    console.error('Error deleting vehicle type:', error);
  }
};

// Go back to master page
const backMaster = () => {
  router.push('/master');
};

// Fetch vehicle types on mount
onMounted(getVehicleTypes);

</script>
