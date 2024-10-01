<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  editedIdentity: Identity | null;
}>();

interface Identity {
  identitas_id: string;
  identitas_name: string;
  identitas_desc: string;
}

const localIdentity = ref<Identity>({
  identitas_id: '',
  identitas_name: '',
  identitas_desc: '',
});

const dialogTitle = ref('Create Identity');
const emit = defineEmits(['save', 'cancel']);

watch(() => props.editMode, (newVal) => {
  dialogTitle.value = newVal ? 'Edit Identity' : 'Create Identity';
});

watch(() => props.editedIdentity, (newIdentity) => {
  if (newIdentity) {
    localIdentity.value = { ...newIdentity };
  } else {
    localIdentity.value = {
      identitas_id: '',
      identitas_name: '',
      identitas_desc: '',
    };
  }
});

const save = () => {
  emit('save', localIdentity.value);
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
            v-model="localIdentity.identitas_name"
            label="Identity Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="localIdentity.identitas_desc"
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
