<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLoading } from '../../hooks';
import { getIdentityAPI, createIdentityAPI, updateIdentityAPI, deleteIdentityAPI } from '@/api/master/masterIdentity';

interface Identity {
  identitas_name: string;
  identitas_desc: string;
}

const identities = ref<Identity[]>([]);
const editMode = ref<boolean>(false);
const editedIdentity = ref<Identity | null>(null);
const showDialog = ref<boolean>(false);
const deleteDialog = ref<boolean>(false);
const deleting = ref<boolean>(false);
const snackbar = ref({ show: false, text: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();

const tableHeaders = [
  { title: 'Identity Name', key: 'identitas_name' },
  { title: 'Description', key: 'identitas_desc' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const getIdentityTypes = async () => {
  showLoading();
  try {
    const response = await getIdentityAPI();
    identities.value = response.data;
  } catch (error) {
    console.error('Error fetching identity types:', error);
    showSnackbar('Error fetching identity types', 'error');
  } finally {
    hideLoading();
  }
};

const saveIdentityType = async (payload: Identity) => {
  try {
    if (editMode.value && editedIdentity.value) {
      await updateIdentityAPI(editedIdentity.value.identitas_id, payload);
      showSnackbar('Identity type updated successfully!', 'success');
    } else {
      await createIdentityAPI(payload);
      showSnackbar('Identity type added successfully!', 'success');
    }
    await getIdentityTypes();
    showDialog.value = false;
  } catch (error) {
    console.error('Error saving identity type:', error);
    showSnackbar('Error saving identity type', 'error');
  }
};

const createIdentity = () => {
  editMode.value = false;
  showDialog.value = true;
  editedIdentity.value = {
    identitas_name: '',
    identitas_desc: '',
  };
};

const handleCancel = () => {
  showDialog.value = false;
  editMode.value = false;
  editedIdentity.value = null;
};

const editIdentityType = (identity: Identity) => {
  editMode.value = true;
  editedIdentity.value = { ...identity };
  showDialog.value = true;
};

const confirmDelete = (identity: Identity) => {
  editedIdentity.value = identity;
  deleteDialog.value = true;
};

const deleteIdentityType = async () => {
  if (!editedIdentity.value) return;

  deleting.value = true;
  try {
    await deleteIdentityAPI(editedIdentity.value.identitas_id);
    await getIdentityTypes();
    deleteDialog.value = false;
    showSnackbar('Identity type deleted successfully!', 'success');
  } catch (error) {
    console.error('Error deleting identity type:', error);
    showSnackbar('Error deleting identity type', 'error');
  } finally {
    deleting.value = false;
  }
};

// Show snackbar with feedback
const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

onMounted(() => {
  getIdentityTypes();
});
</script>

<template>
  <ParentCard title="Identity" v-loading="loading">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h5">Identity Type List</span>
        <v-btn color="primary" @click="createIdentity" prepend-icon="mdi-plus">
          Create
        </v-btn>
      </v-card-title>

      <v-data-table
        :headers="tableHeaders"
        :items="identities"
        :loading="loading"
        class="elevation-1"
      >
        <template v-slot:item.actions="{ item }">
          <v-btn icon @click="editIdentityType(item)" class="mr-2" color="primary">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="confirmDelete(item)" color="error">
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <IdentityDialog
      v-model:show="showDialog"
      :editMode="editMode"
      :editedIdentity="editedIdentity"
      @save="saveIdentityType"
      @cancel="handleCancel"
    />

    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title>Confirm Deletion</v-card-title>
        <v-divider />
        <v-card-text>Are you sure you want to delete this identity type?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="bg-error" variant="text" @click="deleteIdentityType" :loading="deleting">Delete</v-btn>
          <v-btn color="bg-grey" variant="text" @click="deleteDialog = false">Cancel</v-btn>
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
