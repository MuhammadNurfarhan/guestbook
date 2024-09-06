<template>
  <v-container>
      <v-card-title class="text-h4">User Management</v-card-title>
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          item-value="id"
          class="elevation-1"
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
                <v-btn small color="primary" @click="editUser(item)" class="mr-2">Edit</v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card-text>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

// Define headers for the table
const headers = [
  { title: 'Name', value: 'name' },
  { title: 'Email', value: 'email' },
  { title: 'Role', value: 'role' },
  { title: 'Actions', value: 'actions', sortable: false }
];

// Reactive states for users and loading indicator
const users = ref([]);
const loading = ref(false);

// Fetch user data from the backend API
const fetchUsers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`http://localhost:4433/api/user`);
    console.log('User data:', response.data);
    users.value = response.data.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
  } finally {
    loading.value = false;
  }
};

// Call the fetchUsers function when the component is mounted
onMounted(fetchUsers);

// Refresh user data when clicking the refresh button
const refreshData = () => {
  fetchUsers();
};

// Edit user action
const editUser = (user: any) => {
  // Code to edit user can be added here
  console.log('Edit user:', user);
};


</script>

<style scoped>
.v-card-title {
  font-weight: bold;
}
</style>
