<template>
  <v-container>
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Vendor</span>
      </v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="Vendor_name"
            :rules="[rules.required]"
            label="Vendor Name"
            variant="outlined"
            class="mb-2"
            ref="vendorNameField"
            required
          ></v-text-field>
          <v-textarea
            v-model="Vendor_desc"
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
import { nextTick, ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const valid = ref(false);
const Vendor_name = ref('');
const Vendor_desc = ref('');
const router = useRouter();

// Ref for the Vendor Name field
const vendorNameField = ref(null);

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Method to add vendor
const addVendor = async () => {

  if (valid.value) {

    try {
      const payload = {
        Vendor_name: Vendor_name.value,
        Vendor_desc: Vendor_desc.value
      };
      console.log('Payload sent to backend:', payload);

      // @ts-ignore
      await axios.post(`http://172.17.10.222:4433/api/vendor`, payload);

      // Handle success, e.g., clear form, show success message, etc.
      Vendor_name.value = '';
      Vendor_desc.value = '';
      valid.value = false;
      alert('Vendor added successfully!');

      // Use nextTick to ensure DOM updates before focusing
      await nextTick();
      if (vendorNameField.value) {
        (vendorNameField.value as HTMLInputElement).focus();
      }
    } catch (error) {
      console.error('Error adding vendor:', error);
    }
  } else {
    alert('Please fill in the required fields.');
  }
};

const backMaster = () => {
  router.push('/master');
};

</script>
