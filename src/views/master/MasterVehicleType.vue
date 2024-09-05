<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Vehicle Type</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="Vehicle_name"
            :rules="[rules.required]"
            label="Vehicle Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="Vehicle_desc"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addVehicleType" class="mr-4">Add Vehicle Type</v-btn>
          <v-btn variant="outlined" @click="backMaster">Back</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const valid = ref(false);
const Vehicle_name = ref('');
const Vehicle_desc = ref('');
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add car type
const addVehicleType = async () => {
  try {
    await axios.post('http://172.17.10.222:433/api/vehicle', {
      Vehicle_name: Vehicle_name.value,
      Vehicle_desc: Vehicle_desc.value
    });

    // Handle success, e.g., clear form, show success message, etc.
    Vehicle_name.value = '';
    Vehicle_desc.value = '';
    valid.value = false;
    alert('Vehicle type added successfully!');
  } catch (error) {
    console.error('Error adding vehicle type:', error);
  }
};

const backMaster = () => {
  // Assuming 'useRouter' is imported from 'vue-router'
  router.push('/master');
};
</script>
