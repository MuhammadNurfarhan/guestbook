<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Vehicle Type</span>
      </v-card-title>
      <v-divider />
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="vehicle_name"
            :rules="[rules.required]"
            label="Vehicle Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="vehicle_desc"
            :rules="[rules.required]"
            label="Vehicle Description"
            variant="outlined"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn :disabled="!valid" class="bg-primary" @click="save">Save</v-btn>
        <v-btn class="bg-error" @click="cancel">Cancel</v-btn>
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
const vehicle_name = ref('');
const vehicle_desc = ref('');
const valid = ref(false);

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Watch for dialog visibility
watch(() => props.show, (newValue) => {
  dialog.value = newValue;
});

// Save handler
const save = () => {
  if (valid.value) {
    emit('save', { vehicle_name: vehicle_name.value, vehicle_desc: vehicle_desc.value });
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

// Reset form fields
const resetForm = () => {
  vehicle_name.value = '';
  vehicle_desc.value = '';
  valid.value = false;
};

// Sync dialog state with parent
watch(dialog, (newValue) => {
  emit('update:show', newValue);
});
</script>
