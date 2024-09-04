<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Destination Building</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="destinateName"
            :rules="[rules.required]"
            label="Destination Building Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="destinateDescription"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addDestinationBuilding" class="mr-4">Add Destination Building</v-btn>
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
const destinateName = ref('');
const destinateDescription = ref('');
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add destination building
const addDestinationBuilding = async () => {
  try {
    await axios.post('http://localhost:3000/destination-buildings', {
      destinateName: destinateName.value,
      destinateDescription: destinateDescription.value,
    });

    // Handle success, e.g., clear form, show success message, etc.
    destinateName.value = '';
    destinateDescription.value = '';
    valid.value = false;
    alert('Destination building added successfully!');
  } catch (error) {
    console.error('Error adding destination building:', error);
  }
};

const backMaster = () => {
  // Assuming 'useRouter' is imported from 'vue-router'
  router.push('/master');
};
</script>
