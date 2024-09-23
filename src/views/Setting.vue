<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h4">User Management</v-card-title>
      <v-card-text>
        <v-data-table
          :items="users"
          :headers="headers"
          :loading="loading"
          item-value="id"
          class="elevation-1"
          :items-per-page-options="[5, 10, 20, 50]"
          :items-per-page="itemsPerPage"
          loading-text="Loading user data..."
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>User List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-text-field
                v-model="search"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                label="Search"
                class="mr-4"
                single-line
                hide-details
              ></v-text-field>
              <v-btn @click="openAddDialog" class="mr-2 bg-primary">Add User</v-btn>
              <v-btn variant="outlined" @click="refreshData" :loading="loading" append-icon="mdi-refresh">Refresh</v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>
                <v-btn small color="primary" @click="openEditDialog(item)" class="mr-2">Edit</v-btn>
                <v-btn small color="error" @click="confirmDelete(item)">Delete</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <!-- Add/Edit User Dialog -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>{{ formTitle }}</v-card-title>
        <v-card-text>
          <v-form ref="form" v-model="valid" @submit.prevent="saveUser">
            <v-text-field
              v-model="editedUser.name"
              label="Name"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedUser.email"
              label="Email"
              :rules="[
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'Email must be valid'
              ]"
              required
            ></v-text-field>
            <v-select
              v-model="editedUser.role"
              :items="roles"
              label="Role"
              :rules="[v => !!v || 'Role is required']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn class="bg-primary" @click="saveUser" :disabled="!valid || saving">Save</v-btn>
          <v-btn class="bg-error" @click="closeDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title>Confirm Delete</v-card-title>
        <v-card-text>Are you sure you want to delete this user?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error" @click="deleteUser" :loading="deleting">Delete</v-btn>
          <v-btn color="grey" @click="deleteDialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import axios from 'axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

const headers = [
  { title: 'Name', key: 'name' },
  { title: 'Email', key: 'email' },
  { title: 'Role', key: 'role' },
  { title: 'Actions', key: 'actions', sortable: false }
];

const users = ref<User[]>([]);
const loading = ref(false);
const dialog = ref(false);
const deleteDialog = ref(false);
const valid = ref(false);
const saving = ref(false);
const deleting = ref(false);
const search = ref('');
const itemsPerPage = ref(10);

const editedUser = ref<User>({
  id: 0,
  name: '',
  email: '',
  role: ''
});

const roles = ['Super Admin', 'Admin', 'User'];

const form = ref(null);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
});

const formTitle = computed(() => editedUser.value.id ? 'Edit User' : 'Add User');

const filteredUsers = computed(() => {
  return users.value.filter(user =>
    user.name.toLowerCase().includes(search.value.toLowerCase()) ||
    user.email.toLowerCase().includes(search.value.toLowerCase()) ||
    user.role.toLowerCase().includes(search.value.toLowerCase())
  );
});

const getUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`);
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    showSnackbar('Failed to fetch user data', 'error');
  } finally {
    loading.value = false;
  }
};

onMounted(getUsers);

const refreshData = () => {
  getUsers();
};

const openAddDialog = () => {
  editedUser.value = { id: 0, name: '', email: '', role: '' };
  dialog.value = true;
};

const openEditDialog = (user: User) => {
  editedUser.value = { ...user };
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  editedUser.value = { id: 0, name: '', email: '', role: '' };
  (form.value as any)?.reset();
};

const saveUser = async () => {
  if (!(form.value as any).validate()) return;

  saving.value = true;
  try {
    const isNew = !editedUser.value.id;
    const response = isNew
      ? await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, editedUser.value)
      : await axios.put(`${import.meta.env.VITE_API_URL}/api/user/${editedUser.value.id}`, editedUser.value);

    if (isNew) {
      users.value.push(response.data);
    } else {
      const index = users.value.findIndex(user => user.id === editedUser.value.id);
      if (index !== -1) users.value[index] = response.data;
    }

    showSnackbar(`User ${isNew ? 'added' : 'updated'} successfully`, 'success');
    closeDialog();
  } catch (error) {
    console.error('Error saving user data:', error);
    showSnackbar(`Failed to ${editedUser.value.id ? 'update' : 'add'} user`, 'error');
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (user: User) => {
  editedUser.value = { ...user };
  deleteDialog.value = true;
};

const deleteUser = async () => {
  deleting.value = true;
  try {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/${editedUser.value.id}`);
    const index = users.value.findIndex(user => user.id === editedUser.value.id);
    if (index !== -1) users.value.splice(index, 1);
    showSnackbar('User deleted successfully', 'success');
    deleteDialog.value = false;
  } catch (error) {
    console.error('Error deleting user:', error);
    showSnackbar('Failed to delete user', 'error');
  } finally {
    deleting.value = false;
  }
};

const showSnackbar = (text: string, color: string) => {
  snackbar.value = { show: true, text, color };
};

watch(search, () => {
  users.value = filteredUsers.value;
});
</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
