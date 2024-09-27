<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios';
import AddVehicleDialog from './components/AddVehicleDialog.vue';
import { useLoading } from '../../hooks';

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_desc: string;
}

const showDialog = ref(false);
const deleteDialog = ref(false);
const vehicles = ref<Vehicle[]>([]);
const editMode = ref(false);
const editedItem = ref<Vehicle | null>(null);
const itemToDelete = ref<Vehicle | null>(null);
const { loading, showLoading, hideLoading } = useLoading();

const snackbar = reactive({
  show: false,
  text: '',
  color: '',
});

const tableHeaders = [
  { title: 'Vehicle Name', key: 'vehicle_name' },
  { title: 'Description', key: 'vehicle_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getVehicleTypes = async () => {
  showLoading();
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicle`);
    vehicles.value = response.data.data;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    showSnackbar('Error fetching vehicle types', 'error');
  } finally {
    hideLoading();
  }
};

const saveVehicleType = async (vehicleData: Vehicle) => {
  try {
    if (editMode.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/vehicle/${vehicleData.vehicle_id}`, vehicleData);
      showSnackbar('Vehicle type updated successfully!', 'success');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/vehicle`, vehicleData);
      showSnackbar('Vehicle type added successfully!', 'success');
    }
    await getVehicleTypes();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving vehicle type:', error);
    showSnackbar('Error saving vehicle type', 'error');
  }
};

const editVehicleType = (item: Vehicle) => {
  editMode.value = true;
  editedItem.value = { ...item };
  showDialog.value = true;
};

const confirmDelete = (item: Vehicle) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

const deleteVehicleType = async () => {
  if (!itemToDelete.value) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/vehicle/${itemToDelete.value.vehicle_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getVehicleTypes();
    showSnackbar('Vehicle type deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting vehicle type:', error);
    showSnackbar('Error deleting vehicle type', 'error');
  } finally {
    deleteDialog.value = false;
    itemToDelete.value = null;
  }
};

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedItem.value = null;
};

const showSnackbar = (text: string, color: string) => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

onMounted(getVehicleTypes);
</script>

<template>
  <ParentCard title="Vehicles" v-loading="loading">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Vehicle Type List</span>
            <v-btn color="primary" @click="showDialog = true" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="vehicles"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editVehicleType(item)" color="primary">
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon @click="confirmDelete(item)" color="error">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <AddVehicleDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedItem="editedItem"
      @save="saveVehicleType"
      @cancel="handleCancel"
    />

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this vehicle type?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteVehicleType">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </ParentCard>
</template>
