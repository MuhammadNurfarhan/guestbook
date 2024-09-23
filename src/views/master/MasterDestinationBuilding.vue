<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn variant="outlined" @click="backMaster" prepend-icon="mdi-arrow-left">
          Back
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Destination Building List</span>
            <v-btn color="primary" @click="openCreateDialog" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="destinationBuildings"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editDestinationBuilding(item)" color="primary">
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

    <AddDestinationDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedItem="editedItem"
      @save="saveDestinationBuilding"
      @cancel="handleCancel"
    />

    <!-- Confirmation dialog for delete action -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this destination building?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteDestinationBuilding">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddDestinationDialog from './components/AddDestinationDialog.vue';

interface DestinationBuilding {
  destinate_id: string;
  destinate_name: string;
  destinate_desc: string;
}

// State variables
const showDialog = ref(false);
const deleteDialog = ref(false);
const loading = ref(false);
const destinationBuildings = ref<DestinationBuilding[]>([]);
const router = useRouter();
const editMode = ref(false);
const editedItem = ref<DestinationBuilding | null>(null);
const itemToDelete = ref<DestinationBuilding | null>(null);

// Snackbar state
const snackbar = reactive({
  show: false,
  text: '',
  color: '',
});

// Table headers configuration
const tableHeaders = [
  { title: 'Destination Building Name', key: 'destinate_name' },
  { title: 'Description', key: 'destinate_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Fetch destination buildings from API
const getDestinationBuildings = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinate`);
    destinationBuildings.value = response.data.data;
  } catch (error) {
    showSnackbar('Error fetching destination buildings', 'error');
    console.error('Error fetching destination buildings:', error);
  } finally {
    loading.value = false;
  }
};

// Save destination building function
const saveDestinationBuilding = async (destinationData: DestinationBuilding) => {
  try {
    if (editMode.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/destinate/${destinationData.destinate_id}`, destinationData);
      showSnackbar('Destination building updated successfully!', 'success');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/destinate`, destinationData);
      showSnackbar('Destination building added successfully!', 'success');
    }
    await getDestinationBuildings();
    showDialog.value = false;
  } catch (error) {
    showSnackbar('Error saving destination building', 'error');
    console.error('Error saving destination building:', error);
  }
};

// Open dialog to create a new destination building
const openCreateDialog = () => {
  editMode.value = false;
  editedItem.value = null;
  showDialog.value = true;
};

// Edit an existing destination building
const editDestinationBuilding = (item: DestinationBuilding) => {
  editMode.value = true;
  editedItem.value = { ...item };
  showDialog.value = true;
};

// Confirm delete action
const confirmDelete = (item: DestinationBuilding) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

// Delete destination building function
const deleteDestinationBuilding = async () => {
  if (!itemToDelete.value) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/destinate/${itemToDelete.value.destinate_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showSnackbar('Destination building deleted successfully!', 'success');
    await getDestinationBuildings();
  } catch (error) {
    showSnackbar('Error deleting destination building', 'error');
    console.error('Error deleting destination building:', error);
  } finally {
    deleteDialog.value = false;
    itemToDelete.value = null;
  }
};

// Handle cancel action
const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedItem.value = null;
};

// Go back to the master page
const backMaster = () => {
  router.push('/master');
};

// Show snackbar with feedback
const showSnackbar = (text: string, color: string) => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

// Fetch destination buildings on component mount
onMounted(getDestinationBuildings);
</script>
