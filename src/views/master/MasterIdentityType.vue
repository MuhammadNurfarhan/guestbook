<template>
  <v-container>
    <div class="mt-5">
      <v-btn variant="outlined" @click="backMaster">
        <v-icon icon="mdi-arrow-left"></v-icon>Back
      </v-btn>
      <v-card-title>
        <span class="text-h5">Identity Type List</span>
        <div class="float-right">
          <v-btn color="primary" @click="showDialog = true">Create</v-btn>
        </div>
      </v-card-title>
      <v-card-text>
        <v-data-table
          :headers="tableHeaders"
          :items="identities"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.identitas_name }}</td>
              <td>{{ item.identitas_desc }}</td>
              <td>
                <v-btn icon @click="deleteIdentityType(item.identitas_id)">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </div>

    <!-- Dialog for adding a new identity type -->
    <AddIdentityDialog
      v-model:show="showDialog"
      @save="addIdentityType"
      @cancel="handleCancel"
    />
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import AddIdentityDialog from './components/AddIdentityDialog.vue';

interface Identity {
  identitas_id: string;
  identitas_name: string;
  identitas_desc: string;
}

const showDialog = ref(false);
const identities = ref<Identity[]>([]);
const router = useRouter();

// Table headers
const tableHeaders = [
  { title: 'Identity Name', value: 'identitas_name' },
  { title: 'Description', value: 'identitas_desc' },
  { title: 'Actions', value: 'actions', sortable: false },
];

// Fetch identity types from API
const getIdentityTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/identitas`);
    identities.value = response.data.data;
  } catch (error) {
    console.error('Error fetching identity types:', error);
  }
};

// Add identity type function
const addIdentityType = async (identityData: { identitas_name: string; identitas_desc: string }) => {
  try {
    await axios.post(`${import.meta.env.VITE_API_URL}/api/identitas`, identityData);
    await getIdentityTypes(); // Refresh the identity list after adding
    showDialog.value = false; // Close dialog after success
    alert('Identity type added successfully!');
  } catch (error) {
    console.error('Error adding identity type:', error);
  }
};

// Handle cancel
const handleCancel = () => {
  showDialog.value = false;
};

// Delete identity type function
const deleteIdentityType = async (id: string) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/identitas/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await getIdentityTypes(); // Refresh the identity list after deletion
  } catch (error) {
    console.error('Error deleting identity type:', error);
  }
};

// Go back to master page
const backMaster = () => {
  router.push('/master');
};

// Fetch identity types on mount
onMounted(getIdentityTypes);
</script>
