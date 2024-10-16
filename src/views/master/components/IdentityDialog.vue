<script setup lang="ts">
import { createIdentityAPI, updateIdentityAPI } from '@/api/master/masterIdentity';

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
    identitas_name: '',
    identitas_desc: '',
  },
});

const handleCancelClick = () => {
  emit('close');
};

const handleSaveClick = () => {
  const request =
    props.action.type === "create"
      ? createIdentityAPI
      : updateIdentityAPI;

  request(state.formData).then(() => {
    emit('close');
  });
};

onBeforeMount(() => {

  if (props.action.type === 'update') {
    state.formData = {...props.action.data };
  } else if (props.action.type === 'create') {
    state.formData = {
      identitas_name: '',
      identitas_desc: '',
    };
  }
});

</script>

<template>
  <v-dialog v-model="dialogState" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }} Identity</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="state.formData.identitas_name"
            label="Identity Name"
            variant="outlined"
            color="primary"
            required
          />
          <v-textarea
            v-model="state.formData.identitas_desc"
            label="Description"
            variant="outlined"
            rows="2"
            color="primary"
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
