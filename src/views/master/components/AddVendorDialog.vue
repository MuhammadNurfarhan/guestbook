<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Vendor</span>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="vendor_name"
            label="Vendor Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="vendor_desc"
            label="Vendor Description"
            variant="outlined"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel">Cancel</v-btn>
        <v-btn :disabled="!valid" color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['save', 'cancel', 'update:show']);

const dialog = ref(props.show);
const vendor_name = ref('');
const vendor_desc = ref('');
const valid = ref(false);

// Watch for dialog visibility
watch(() => props.show, (newValue) => {
  dialog.value = newValue;
});

// Save handler
const save = () => {
  if (valid.value) {
    emit('save', { vendor_name: vendor_name.value, vendor_desc: vendor_desc.value });
    dialog.value = false;
    resetForm();
  }
};

// Cancel handler
const cancel = () => {
  emit('cancel');
  dialog.value = false;
  resetForm();
};

// Reset form
const resetForm = () => {
  vendor_name.value = '';
  vendor_desc.value = '';
  valid.value = false;
};

// Sync dialog state with parent
watch(dialog, (newValue) => {
  emit('update:show', newValue);
});
</script>
