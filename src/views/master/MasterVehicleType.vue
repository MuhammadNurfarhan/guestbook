<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoading } from '../../hooks';
import { getVehicleAPI, createVehicleAPI, updateVehicleAPI, deleteVehicleAPI } from '@/api/master/masterVehicle';

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_desc: string;
}

const vehicles = ref<Vehicle[]>([]);
const editMode = ref<boolean>(false);
const editedVehicle = ref<Vehicle | null>(null);
const showDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const deleting = ref<boolean>(false);
const snackbar = ref({ show: false, text: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Vehicle Name', key: 'vehicle_name' },
  { title: 'Description', key: 'vehicle_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getVehicleTypes = async () => {
  showLoading();
  try {
    const response = await getVehicleAPI();
    vehicles.value = response.data;
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
    showSnackbar('Error fetching vehicle types', 'error');
  } finally {
    hideLoading();
  }
};

const saveVehicleType = async (payload: Vehicle) => {
  try {
    if (editMode.value && editedVehicle.value) {
      await updateVehicleAPI(editedVehicle.value.vehicle_id, payload);
      showSnackbar('Vehicle type updated successfully!', 'success');
    } else {
      await createVehicleAPI(payload);
      showSnackbar('Vehicle type added successfully!', 'success');
    }
    await getVehicleTypes();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving vehicle type:', error);
    showSnackbar('Error saving vehicle type', 'error');
  }
};

const createVehicle = () => {
  editMode.value = false;
  showDialog.value = true;
  editedVehicle.value = {
    vehicle_name: '',
    vehicle_desc: '',
  };
}

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedVehicle.value = null;
};

const editVehicleType = (vehicle: Vehicle) => {
  editMode.value = true;
  editedVehicle.value = { ...vehicle };
  showDialog.value = true;
};

const confirmDelete = (vehicle: Vehicle) => {
  deleting.value = vehicle;
  deleteDialog.value = true;
};

const deleteVehicleType = async () => {
  if (!deleting.value) return;

  try {
    await deleteVehicleAPI(deleting.value.vehicle_id);
    await getVehicleTypes();
    deleteDialog.value = false;
    showSnackbar('Vehicle type deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting vehicle type:', error);
    showSnackbar('Error deleting vehicle type', 'error');
  } finally {
    deleting.value = null;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(() => {
  getVehicleTypes
});
</script>

<template>
  <ParentCard title="Vehicles" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Vehicle Type List</span>
        <v-btn color="primary" @click="createVehicle" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

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
    </v-card>

    <VehicleDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedVehicle="editedVehicle"
      @save="saveVehicleType"
      @cancel="handleCancel"
    />

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-divider />
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

