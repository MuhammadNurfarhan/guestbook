<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import axios from 'axios';
import AddVisitorPurposeDialog from './components/AddVisitorPurposeDialog.vue';
import { useLoading } from '../../hooks';

interface VisitorPurpose {
  purpose_id: string;
  purpose_name: string;
  purpose_desc: string;
}

// State variables
const showDialog = ref(false);
const deleteDialog = ref(false);
const visitorPurposes = ref<VisitorPurpose[]>([]);
const editMode = ref(false);
const editedItem = ref<VisitorPurpose | null>(null);
const itemToDelete = ref<VisitorPurpose | null>(null);
const { loading, showLoading, hideLoading } = useLoading();

// Snackbar state
const snackbar = reactive({
  show: false,
  text: '',
  color: '',
});

// Table headers configuration
const tableHeaders = [
  { title: 'Visitor Purpose', key: 'purpose_name' },
  { title: 'Description', key: 'purpose_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

// Fetch visitor purposes from API
const getVisitorPurposes = async () => {
  showLoading();
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/purpose`);
    visitorPurposes.value = response.data.data;
  } catch (error) {
    showSnackbar('Error fetching visitor purposes', 'error');
    console.error('Error fetching visitor purposes:', error);
  } finally {
    hideLoading();
  }
};

// Save visitor purpose function
const saveVisitorPurpose = async (purposeData: VisitorPurpose) => {
  try {
    if (editMode.value) {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/purpose/${purposeData.purpose_id}`, purposeData);
      showSnackbar('Visitor purpose updated successfully!', 'success');
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/purpose`, purposeData);
      showSnackbar('Visitor purpose added successfully!', 'success');
    }
    await getVisitorPurposes();
    showDialog.value = false;
  } catch (error) {
    showSnackbar('Error saving visitor purpose', 'error');
    console.error('Error saving visitor purpose:', error);
  }
};

// Open dialog to create a new visitor purpose
const openCreateDialog = () => {
  editMode.value = false;
  editedItem.value = null;
  showDialog.value = true;
};

// Edit an existing visitor purpose
const editVisitorPurpose = (item: VisitorPurpose) => {
  editMode.value = true;
  editedItem.value = { ...item };
  showDialog.value = true;
};

// Confirm delete action
const confirmDelete = (item: VisitorPurpose) => {
  itemToDelete.value = item;
  deleteDialog.value = true;
};

// Delete visitor purpose function
const deleteVisitorPurpose = async () => {
  if (!itemToDelete.value) return;

  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/purpose/${itemToDelete.value.purpose_id}`);
    showSnackbar('Visitor purpose deleted successfully!', 'success');
    await getVisitorPurposes();
  } catch (error) {
    showSnackbar('Error deleting visitor purpose', 'error');
    console.error('Error deleting visitor purpose:', error);
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

// Fetch visitor purposes on component mount
onMounted(getVisitorPurposes);
</script>

<template>
  <ParentCard title="Visitor Purpose" v-loading="loading">
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title class="d-flex justify-space-between align-center">
            <span class="text-h5">Visitor Purpose List</span>
            <v-btn color="primary" @click="openCreateDialog" prepend-icon="mdi-plus">
              Create
            </v-btn>
          </v-card-title>

          <v-card-text>
            <v-data-table
              :headers="tableHeaders"
              :items="visitorPurposes"
              :loading="loading"
              class="elevation-1"
            >
              <template v-slot:item.actions="{ item }">
                <v-btn icon @click="editVisitorPurpose(item)" color="primary">
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

    <AddVisitorPurposeDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedItem="editedItem"
      @save="saveVisitorPurpose"
      @cancel="handleCancel"
    />

    <!-- Confirmation dialog for delete action -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-card-text>Are you sure you want to delete this visitor purpose?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="text" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="text" @click="deleteVisitorPurpose">Delete</v-btn>
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
