<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  editedPurpose: Purpose | null;
}>();

interface Purpose {
  purpose_id: string;
  purpose_name: string;
  purpose_desc: string;
}

const localPurpose = ref<Purpose>({
  purpose_id: '',
  purpose_name: '',
  purpose_desc: '',
});

const dialogTitle = ref('Create Purpose');
const emit = defineEmits(['save', 'cancel']);

watch(() => props.editMode, (newVal) => {
  dialogTitle.value = newVal ? 'Edit Purpose' : 'Create Purpose';
});

watch(() => props.editedPurpose, (newPurpose) => {
  if (newPurpose) {
    localPurpose.value = { ...newPurpose };
  } else {
    localPurpose.value = {
      purpose_id: '',
      purpose_name: '',
      purpose_desc: '',
    };
  }
});

const save = () => {
  emit('save', localPurpose.value);
};

const cancel = () => {
  emit('cancel');
};
</script>

<template>
  <v-dialog v-model="props.show" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }}</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="localPurpose.purpose_name"
            label="Purpose Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="localPurpose.purpose_desc"
            label="Description"
            variant="outlined"
            rows="2"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="bg-primary" @click="save">Save</v-btn>
        <v-btn class="bg-error" @click="cancel">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
