<template>
  <v-container>
    <div class="mt-5">
      <v-btn variant="outlined" @click="backMaster">
        <v-icon icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
      <v-card-title>
        <span class="text-h5">Destination Building List</span>
        <div class="float-right">
          <v-btn color="primary" @click="showDialog = true">Create</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="destinationBuildings"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.Destinate_name }}</td>
              <td>{{ item.Destinate_desc }}</td>
              <td>
                <v-btn icon @click="deleteDestinationBuilding(item.Destinate_id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </div>

    <!-- Dialog for adding a new destination building -->
    <AddDestinationDialog
      v-model:show="showDialog"
      @save="addDestinationBuilding"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddDestinationDialog from './components/AddDestinationDialog.vue';

interface DestinationBuilding {
  destinate_id: string;
  destinate_name: string;
  destinate_desc: string;
}

const showDialog = ref(false);
const destinationBuildings = ref<DestinationBuilding[]>([]);
const router = useRouter();

// Table headers
const tableHeaders = [
  { title: 'Destination Building Name', value: 'destinate_name' },
  { title: 'Description', value: 'destinate_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch destination buildings from API
const getDestinationBuildings = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinate`);
    destinationBuildings.value = response.data.data;
  } catch (error) {
    console.error('Error fetching destination buildings:', error);
  }
};

// Add destination building function
const addDestinationBuilding = async (destinationData: { destinate_name: string; destinate_desc: string }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/destinate`, destinationData);
    await getDestinationBuildings(); // Refresh the destination list after adding
    showDialog.value = false; // Close dialog after success
    alert('Destination building added successfully!');
  } catch (error) {
    console.error('Error adding destination building:', error);
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
};

// Delete destination building function
const deleteDestinationBuilding = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/destinate/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getDestinationBuildings(); // Refresh the destination list after deletion
  } catch (error) {
    console.error('Error deleting destination building:', error);
  }
};

// Go back to master page
const backMaster = () => {
  router.push('/master');
};

// Fetch destination buildings on mount
onMounted(getDestinationBuildings);
</script>
