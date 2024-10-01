<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  editedDestinate: Destinate | null;
}>();

interface Destinate {
  destinate_id: string;
  destinate_name: string;
  destinate_desc: string;
}

const localDestinate = ref<Destinate>({
  destinate_id: '',
  destinate_name: '',
  destinate_desc: '',
});

const dialogTitle = ref('Create Destinate');
const emit = defineEmits(['save', 'cancel']);

watch(() => props.editMode, (newVal) => {
  dialogTitle.value = newVal ? 'Edit Destination' : 'Create Destination';
});

watch(() => props.editedDestinate, (newDestinate) => {
  if (newDestinate) {
    localDestinate.value = { ...newDestinate };
  } else {
    localDestinate.value = {
      destinate_id: '',
      destinate_name: '',
      destinate_desc: '',
    };
  }
});

const save = () => {
  emit('save', localDestinate.value);
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
            v-model="localDestinate.destinate_name"
            label="Destination Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="localDestinate.destinate_desc"
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
