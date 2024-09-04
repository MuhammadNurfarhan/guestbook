<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Vendor</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="vendorName"
            :rules="[rules.required]"
            label="Vendor Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="vendorDescription"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addVendor" class="mr-4">Add Vendor</v-btn>
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
const router = useRouter();

const valid = ref(false);
const vendorName = ref('');
const vendorDescription = ref('');

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add vendor
const addVendor = async () => {
  try {
    await axios.post('http://localhost:3000/vendors', {
      vendorName: vendorName.value,
      vendorDescription: vendorDescription.value
    });

    // Handle success, e.g., clear form, show success message, etc.
    vendorName.value = '';
    vendorDescription.value = '';
    valid.value = false;
    alert('Vendor added successfully!');
  } catch (error) {
    console.error('Error adding vendor:', error);
  }
};

const backMaster = () => {
  // Assuming 'useRouter' is imported from 'vue-router'
  router.push('/master');
};

</script>
