<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Add Master Destination Building</span>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-text-field
            v-model="destinate_name"
            :rules="[rules.required]"
            label="Destination Building Name"
            variant="outlined"
            class="mb-2"
            required
          ></v-text-field>
          <v-textarea
            v-model="destinate_desc"
            :rules="[rules.required]"
            label="Destination Description"
            variant="outlined"
          ></v-textarea>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancel</v-btn>
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
const destinate_name = ref('');
const destinate_desc = ref('');
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
    emit('save', { destinate_name: destinate_name.value, destinate_desc: destinate_desc.value });
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
  destinate_name.value = '';
  destinate_desc.value = '';
  valid.value = false;
};

// Sync dialog state with parent
watch(dialog, (newValue) => {
  emit('update:show', newValue);
});
</script>
