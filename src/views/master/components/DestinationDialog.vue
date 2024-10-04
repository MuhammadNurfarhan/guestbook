<script setup lang="ts">
import { createDestinateAPI, updateDestinateAPI } from '@/api/master/masterDestinate';

const props = defineProps({
  showDialog: Boolean,
  action: Object,
});

const emit = defineEmits(['close']);

const dialogState = computed({
  get: () => props.showDialog,
  set: () => {
    emit('close');
  },
})

const dialogTitle = computed(() => {
  return props.action.type === 'create' ? 'Create' : 'Update';
});

const state = reactive({
  formData: {
    destinate_id: '',
    destinate_name: '',
    destinate_desc: '',
  },
});

const handleCancelClick = () => {
  emit('close');
};

const handleSaveClick = () => {
  const request =
    props.action.type === "create"
      ? createDestinateAPI
      : updateDestinateAPI;

  request(state.formData).then(() => {
    emit('close');
  });
};

onBeforeMount(() => {

  if (props.action.type === 'update') {
    state.formData = {...props.action.data };
  } else if (props.action.type === 'create') {
    state.formData = {
      destinate_name: '',
      destinate_desc: '',
    };
  }
});

</script>

<template>
  <v-dialog v-model="dialogState" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }} Destinate</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="state.formData.destinate_name"
            label="Destination Building Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="state.formData.destinate_desc"
            label="Description"
            variant="outlined"
            rows="2"
            required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-btn class="bg-primary" @click="handleSaveClick">Save</v-btn>
        <v-btn class="bg-error" @click="handleCancelClick">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss"></style>
