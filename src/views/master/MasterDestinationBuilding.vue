<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Destination Building</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="Destinate_name"
            :rules="[rules.required]"
            label="Destination Building Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="Destinate_desc"
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
const Destinate_name = ref('');
const Destinate_desc = ref('');
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add destination building
const addDestinationBuilding = async () => {
  try {
    await axios.post('http://172.17.10.222:433/api/destinate', {
      Destinate_name: Destinate_name.value,
      Destinate_desc: Destinate_desc.value,
    });

    // Handle success, e.g., clear form, show success message, etc.
    Destinate_name.value = '';
    Destinate_desc.value = '';
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
