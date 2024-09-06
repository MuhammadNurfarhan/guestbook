<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Visitor Purpose</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid">
          <v-text-field
            v-model="Purpose_name"
            :rules="[rules.required]"
            label="Visitor Purpose"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="Purpose_desc"
            :rules="[rules.required]"
            label="Description"
            variant="outlined"
            required
          ></v-textarea>
          <v-btn :disabled="!valid" color="primary" @click="addVisitorPurpose" class="mr-4">Add Visitor Purpose</v-btn>
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
const Purpose_name = ref('');
const Purpose_desc = ref('');
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add visitor purpose
const addVisitorPurpose = async () => {
  try {
    // @ts-ignore
    await axios.post(`http://172.17.10.222:4433/api/purpose`, {
      Purpose_name: Purpose_name.value,
      Purpose_desc: Purpose_desc.value
    });

    // Handle success, e.g., clear form, show success message, etc.
    Purpose_name.value = '';
    Purpose_desc.value = '';
    valid.value = false;
    alert('Visitor purpose added successfully!');
  } catch (error) {
    console.error('Error adding visitor purpose:', error);
  }
};

const backMaster = () => {
  // Assuming 'useRouter' is imported from 'vue-router'
  router.push('/master');
};
</script>
