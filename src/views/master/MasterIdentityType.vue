<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Identity Type</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="Identitas_name"
            :rules="[rules.required]"
            label="Identity Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="Identitas_desc"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addIdentityType" class="mr-4">Add Identity Type</v-btn>
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
const Identitas_name = ref('');
const Identitas_desc = ref('');
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add ID type
const addIdentityType = async () => {
  try {
    await axios.post('http://172.17.10.222:433/api/identitas', {
      Identitas_name: Identitas_name.value,
      Identitas_desc: Identitas_desc.value
    });

    // Handle success, e.g., clear form, show success message, etc.
    Identitas_name.value = '';
    Identitas_desc.value = '';
    valid.value = false;
    alert('Identity type added successfully!');
  } catch (error) {
    console.error('Error adding ID type:', error);
  }
};

const backMaster = () => {
  // Assuming 'useRouter' is imported from 'vue-router'
  router.push('/master');
};
</script>
