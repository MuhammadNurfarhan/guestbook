<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoading } from '../../hooks';
import { getPurposeAPI, createPurposeAPI, updatePurposeAPI, deletePurposeAPI } from '@/api/master/masterPurpose';

interface Purpose {
  purpose_name: string;
  purpose_desc: string;
}

const purposes = ref<Purpose[]>([]);
const editMode = ref<boolean>(false);
const editedPurpose = ref<Purpose | null>(null);
const showDialog = ref<boolean>(false);
const closeDialog = ref<boolean>(false);
const deleting = ref<boolean>(false);
const snackbar = ref({ show: false, text: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Visitor Purpose', key: 'purpose_name' },
  { title: 'Description', key: 'purpose_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getPurposes = async () => {
  showLoading();
  try {
    const response = await getPurposeAPI();
    purposes.value = response.data;
  } catch (error) {
    console.error('Error fetching visitor purposes:', error);
    showSnackbar('Error fetching visitor purposes', 'error');
  } finally {
    hideLoading();
  }
};

const savePurpose = async (payload: Purpose) => {
  try {
    if (editMode.value && editedPurpose.value) {
      await updatePurposeAPI(editedPurpose.value.purpose_id, payload);
      showSnackbar('Visitor purpose updated successfully!', 'success');
    } else {
      await createPurposeAPI(payload);
      showSnackbar('Visitor purpose added successfully!', 'success');
    }
    await getPurposes();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving visitor purpose:', error);
    showSnackbar('Error saving visitor purpose', 'error');
  }
};

const createPurpose = () => {
  editMode.value = false;
  showDialog.value = true;
  editedPurpose.value = {
    purpose_name: '',
    purpose_desc: '',
  };
};

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedPurpose.value = null;
};

const editPurpose = (purpose: Purpose) => {
  editMode.value = true;
  editedPurpose.value = { ...purpose };
  showDialog.value = true;
};

const confirmDelete = (purpose: Purpose) => {
  editedPurpose.value = purpose;
  closeDialog.value = true;
};

const deletePurpose = async () => {
  if (!editedPurpose.value) return;

  deleting.value = true;
  try {
    await deletePurposeAPI(editedPurpose.value.purpose_id);
    await getPurposes();
    closeDialog.value = false;
    showSnackbar('Visitor purpose deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting visitor purpose:', error);
    showSnackbar('Error deleting visitor purpose', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(() => {
  getPurposes();
});
</script>

<template>
  <ParentCard title="Visitor Purpose" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Visitor Purpose List</span>
        <v-btn color="primary" @click="createPurpose" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="purposes"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editPurpose(item)" class="mr-2" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="confirmDelete(item)" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <PurposeDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedPurpose="editedPurpose"
      @save="savePurpose"
      @cancel="handleCancel"
    />

    <v-dialog v-model="closeDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-divider />
        <v-card-text>Are you sure you want to delete this visitor purpose?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="bg-error" variant="text" @click="deletePurpose" :loading="deleting">Delete</v-btn>
          <v-btn class="bg-grey" variant="text" @click="closeDialog = false">Cancel</v-btn>
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
