<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import AddIdentityDialog from './components/AddIdentityDialog.vue';
import { useLoading } from '../../hooks';

interface Identity {
  identitas_id: string;
  identitas_name: string;
  identitas_desc: string;
}

// State variables
const showDialog = ref(false);
const deleteDialog = ref(false);
const identities = ref<Identity[]>([]);
const editMode = ref(false);
const editedItem = ref<Identity | null>(null);
const itemToDelete = ref<Identity | null>(null);
const { loading, showLoading, hideLoading } = useLoading();

// Snackbar state
const snackbar = reactive({
  show: false,
  text: '',
  color: '',
});

// Table headers configuration
const tableHeaders = [
  { title: 'Identity Name', key: 'identitas_name' },
  { title: 'Description', key: 'identitas_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Fetch identity types from API
const getIdentityTypes = async () => {
  showLoading();
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/identitas`);
    identities.value = response.data.data;
  } catch (error) {
    showSnackbar('Error fetching identity types', 'error');
    console.error('Error fetching identity types:', error);
  } finally {
    hideLoading();
  }
};

// Save identity type function
const saveIdentityType = async (identityData: Identity) => {
  try {
    if (editMode.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/identitas/${identityData.identitas_id}`, identityData);
      showSnackbar('Identity type updated successfully!', 'success');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/identitas`, identityData);
      showSnackbar('Identity type added successfully!', 'success');
    }
    await getIdentityTypes();
    showDialog.value = false;
  } catch (error) {
    showSnackbar('Error saving identity type', 'error');
    console.error('Error saving identity type:', error);
  }
};

// Open dialog to create a new identity type
const openCreateDialog = () => {
  editMode.value = false;
  editedItem.value = null;
  showDialog.value = true;
};

// Edit an existing identity type
const editIdentityType = (item: Identity) => {
  editMode.value = true;
  editedItem.value = { ...item };
  showDialog.value = true;
};

// Confirm delete action
const confirmDelete = (item: Identity) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

// Delete identity type function
const deleteIdentityType = async () => {
  if (!itemToDelete.value) return;

  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/identitas/${itemToDelete.value.identitas_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    showSnackbar('Identity type deleted successfully!', 'success');
    await getIdentityTypes();
  } catch (error) {
    showSnackbar('Error deleting identity type', 'error');
    console.error('Error deleting identity type:', error);
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

// Show snackbar with feedback
const showSnackbar = (text: string, color: string) => {
  snackbar.text = text;
  snackbar.color = color;
  snackbar.show = true;
};

// Fetch identity types on component mount
onMounted(getIdentityTypes);
</script>

<template>
  <ParentCard title="Identity" v-loading="loading">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Identity Type List</span>
            <v-btn color="primary" @click="openCreateDialog" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="identities"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editIdentityType(item)" color="primary">
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

    <AddIdentityDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedItem="editedItem"
      @save="saveIdentityType"
      @cancel="handleCancel"
    />

    <!-- Confirmation dialog for delete action -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this identity type?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteIdentityType">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn color="white" @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>
  </ParentCard>
</template>
