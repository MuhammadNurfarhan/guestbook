<template>
    <v-data-table
      :headers="headers"
      :items="visitorData"
      class="elevation-1"
    >
      <template v-slot:item="{ item }">
        <v-btn @click="emitEdit(item)" color="primary">Edit</v-btn>
        <v-btn @click="emitDelete(item)" color="error">Delete</v-btn>
      </template>
    </v-data-table>
</template>

<script>
import { ref, defineComponent } from 'vue';

export default defineComponent({
  props: {
    visitorData: {
      type: Array,
      required: true,
    },
  },
  setup(props, { emit }) {
    const headers = ref([
      { title: 'Check In', value: 'checkIn' },
      { title: 'Check Out', value: 'checkOut' },
      { title: 'Visitor ID', value: 'visitorId' },
      { title: 'Visitor Name', value: 'visitorName' },
      { title: 'Vehicle Type', value: 'vehicleType' },
      { title: 'Police Number', value: 'policeNumber' },
      { title: 'Driver Name', value: 'driverName' },
      { title: 'ID Type', value: 'idType' },
      { title: 'ID Number', value: 'idNumber' },
      { title: 'Destination Building', value: 'destinationBuilding' },
      { title: 'Vendor Name', value: 'vendorName' },
      { title: 'Action', value: 'action', sortable: false },
    ]);

    const emitEdit = (item) => {
      emit('edit-item', item);
    };

    const emitDelete = (item) => {
      emit('delete-item', item);
    };

    return {
      headers,
      emitEdit,
      emitDelete,
    };
  },
});
</script>
