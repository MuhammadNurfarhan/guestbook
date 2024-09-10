<template>
  <v-container>
      <v-card-title class="text-h4">User Management</v-card-title>
      <v-card-text>
        <v-data-table
          :items="users"
          :headers="headers"
          :loading="loading"
          item-value="id"
          class="elevation-1"
          items-per-page="10"
          loading-text="Loading user data..."
        >
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>User List</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn variant="outlined" @click="refreshData" append-icon="mdi-refresh">Refresh Data</v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item="{ item }">
            <tr>
              <td>{{ item.name }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.role }}</td>
              <td>
                <v-btn small color="primary" @click="openEditDialog(item)" class="mr-2">Edit</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>

      <!-- Edit User Dialog -->
    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>Edit User</v-card-title>
        <v-card-text>
          <v-form ref="editForm">
            <v-text-field v-model="editedUser.name" label="Name" required></v-text-field>
            <v-text-field v-model="editedUser.email" label="Email" required></v-text-field>
            <v-select
              v-model="editedUser.role"
              :items="roles"
              label="Role"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="saveUser">Save</v-btn>
          <v-btn color="grey" @click="closeEditDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

interface User {
  name: string;
  email: string;
  role: string;
}

// Define headers for the table
const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role' },
  { title: 'Actions', value: 'actions', sortable: false }
];

// Reactive states for users and loading indicator
const users = ref<User[]>([]);
const loading = ref(false);

// State for Edit User Dialog
const editDialog = ref(false);
const editedUser = ref({
  id: null,
  name: '',
  email: '',
  role: ''
});

// Roles for the role selection
const roles = ['Super Admin', 'Admin', 'User'];

// Fetch user data from the backend API
const getUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`);
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
};

// Call the fetchUsers function when the component is mounted
onMounted(getUsers);

// Refresh user data when clicking the refresh button
const refreshData = () => {
  getUsers();
};

// Open edit dialog
const openEditDialog = (user: any) => {
  editedUser.value = { ...user }; // Clone the selected user data into editedUser
  editDialog.value = true; // Open the dialog
};

// Close edit dialog
const closeEditDialog = () => {
  editDialog.value = false;
};

// Save edited user
const saveUser = async () => {
  try {
    const updatedUser = editedUser.value;
    await axios.put(`${import.meta.env.VITE_API_URL}/api/user/${updatedUser.id}`, updatedUser);
    getUsers(); // Refresh the data after successful update
    closeEditDialog(); // Close the dialog
  } catch (error) {
    console.error('Error saving user data:', error);
  }
};


</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
