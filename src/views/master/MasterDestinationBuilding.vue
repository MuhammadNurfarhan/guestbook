<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoading } from '../../hooks';
import { getDestinateAPI, createDestinateAPI, updateDestinateAPI, deleteDestinateAPI } from '@/api/master/masterDestinate';

interface Destinate {
  destinate_name: string;
  destinate_desc: string;
}

const destinates = ref<Destinate[]>([]);
const editMode = ref<boolean>(false);
const editedDestinate = ref<Destinate | null>(null);
const showDialog = ref<boolean>(false);
const closeDialog = ref<boolean>(false);
const deleting = ref<boolean>(false);
const snackbar = ref({ show: false, text: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Destination Building Name', key: 'destinate_name' },
  { title: 'Description', key: 'destinate_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getDestinates = async () => {
  showLoading();
  try {
    const response = await getDestinateAPI();
    destinates.value = response.data;
  } catch (error) {
    console.error('Error fetching destination buildings:', error);
    showSnackbar('Error fetching destination buildings', 'error');
  } finally {
    hideLoading();
  }
};

const saveDestinate = async (payload: Destinate) => {
  try {
    if (editMode.value && editedDestinate.value) {
      await updateDestinateAPI(editedDestinate.value.destinate_id, payload);
      showSnackbar('Destination building updated successfully!', 'success');
    } else {
      await createDestinateAPI(payload);
      showSnackbar('Destination building added successfully!', 'success');
    }
    await getDestinates();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving destination building:', error);
    showSnackbar('Error saving destination building', 'error');
  }
};

const createDestinate = () => {
  editMode.value = false;
  showDialog.value = true;
  editedDestinate.value = {
    destinate_name: '',
    destinate_desc: '',
  };
};

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedDestinate.value = null;
};

const editDestinate = (destinate: Destinate) => {
  editMode.value = true;
  editedDestinate.value = { ...destinate };
  showDialog.value = true;
};

// Confirm delete action
const confirmDelete = (destinate: Destinate) => {
  editedDestinate.value = destinate;
  closeDialog.value = true;
};

// Delete destination building function
const deleteDestinationBuilding = async () => {
  if (!editedDestinate.value) return;

  try {
    await deleteDestinateAPI(editedDestinate.value.destinate_id);
    await getDestinates();
    closeDialog.value = false;
    showSnackbar('Destination building deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting destination building:', error);
    showSnackbar('Error deleting destination building', 'error');
  } finally {
    deleting.value = null;
  }
};

// Show snackbar with feedback
const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(() => {
  getDestinates();
});
</script>

<template>
  <ParentCard title="Destination" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Destination Building List</span>
        <v-btn color="primary" @click="createDestinate" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="destinates"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editDestinate(item)" class="mr-2" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="confirmDelete(item)" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <DestinationDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedDestinate="editedDestinate ? editedDestinate : null"
      @save="saveDestinate"
      @cancel="handleCancel"
    />

    <v-dialog v-model="closeDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-divider />
        <v-card-text>Are you sure you want to delete this destination building?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="bg-error" @click="deleteDestinationBuilding" :loading="deleting">Delete</v-btn>
          <v-btn class="bg-grey" @click="closeDialog = false">Cancel</v-btn>
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
