<template>
  <v-container>
    <FormTransaction
      @save="handleSave"
      @update="handleUpdate"
      @refresh="handleRefresh"
    />
    <h2>Visitor Data</h2>  <!-- Add your own title -->
    <TableTransaction
      :visitorData="visitorData"
      @edit-item="handleEdit"
      @delete-item="handleDelete"
    />
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import FormTransaction from './FormTransaction.vue';
import TableTransaction from './TableTransaction.vue';

// State for visitor data
const visitorData = ref([
  {
    checkIn: '2023/11/02 5:27',
    checkOut: '2023/11/02 6:49',
    visitorId: '2311020002',
    visitorName: 'SADI',
    vehicleType: 'BOX',
    policeNumber: '123456789',
    driverName: 'AHMAD',
    idType: 'E-KTP',
    idNumber: '901125/0003',
    destinationBuilding: 'PENANG',
    vendorName: 'CITYLINK',
  },
]);

// Handle save action (adding new visitor data)
const handleSave = (formData) => {
  console.log('Save data:', formData);
  // Logic to save new visitor data (adding it to visitorData array)
  visitorData.value.push(formData);
};

// Handle update action (updating existing visitor data)
const handleUpdate = (formData) => {
  console.log('Update data:', formData);
  // Logic to update existing visitor data (for example, find and replace)
  const index = visitorData.value.findIndex(
    (visitor) => visitor.visitorId === formData.visitorId
  );
  if (index !== -1) {
    visitorData.value[index] = formData;
  }
};

// Handle refresh action (reloading data or resetting the form)
const handleRefresh = () => {
  console.log('Refresh data');
  // Logic to refresh visitor data (e.g., fetch from server or reset state)
};

// Handle edit action (when an item is edited)
const handleEdit = (item) => {
  console.log('Edit item:', item);
  // Logic to handle editing visitor data (this could open a form with pre-filled data)
};

// Handle delete action (removing an item from the list)
const handleDelete = (item) => {
  console.log('Delete item:', item);
  // Logic to delete visitor data (remove it from visitorData array)
  visitorData.value = visitorData.value.filter(
    (visitor) => visitor.visitorId !== item.visitorId
  );
};
</script>
