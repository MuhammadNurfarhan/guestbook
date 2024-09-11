<template>
  <v-container>
    <div class="mt-5">
      <v-btn variant="outlined" @click="backMaster">
        <v-icon icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
      <v-card-title>
        <span class="text-h5">Visitor Purpose List</span>
        <div class="float-right">
          <v-btn color="primary" @click="showDialog = true">Create</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="visitorPurposes"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.Purpose_name }}</td>
              <td>{{ item.Purpose_desc }}</td>
              <td>
                <v-btn icon @click="deleteVisitorPurpose(item.Purpose_id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </div>

    <!-- Dialog for adding a new visitor purpose -->
    <AddVisitorPurposeDialog
      v-model:show="showDialog"
      @save="addVisitorPurpose"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddVisitorPurposeDialog from './components/AddVisitorPurposeDialog.vue';

interface VisitorPurpose {
  purpose_id: string;
  purpose_name: string;
  purpose_desc: string;
}

const showDialog = ref(false);
const visitorPurposes = ref<VisitorPurpose[]>([]);
const router = useRouter();

// Table headers
const tableHeaders = [
  { title: 'Visitor Purpose', value: 'purpose_name' },
  { title: 'Description', value: 'purpose_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch visitor purposes from API
const getVisitorPurposes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/purpose`);
    visitorPurposes.value = response.data.data;
  } catch (error) {
    console.error('Error fetching visitor purposes:', error);
  }
};

// Add visitor purpose function
const addVisitorPurpose = async (purposeData: { purpose_name: string; purpose_desc: string }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/purpose`, purposeData);
    await getVisitorPurposes(); // Refresh the visitor purpose list after adding
    showDialog.value = false; // Close dialog after success
    alert('Visitor purpose added successfully!');
  } catch (error) {
    console.error('Error adding visitor purpose:', error);
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
};

// Delete visitor purpose function
const deleteVisitorPurpose = async (id: string) => {
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/purpose/${id}`);
    await getVisitorPurposes(); // Refresh the visitor purpose list after deletion
  } catch (error) {
    console.error('Error deleting visitor purpose:', error);
  }
};

// Go back to master page
const backMaster = () => {
  router.push('/master');
};

// Fetch visitor purposes on mount
onMounted(getVisitorPurposes);
</script>
