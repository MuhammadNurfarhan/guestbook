<script setup lang="ts">
import { createUserAPI, updateUserAPI } from '@/api/user/user';

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
    'name': '',
    'email': '',
    'role': '',
    'password': '',
  },
});

const handleCancelClick = () => {
  emit('close');
};

const handleSaveClick = () => {
  const request =
    props.action.type === "create"
      ? createUserAPI
      : updateUserAPI;

  request(state.formData).then(() => {
    emit('close');
  });
};

onBeforeMount(() => {

  if (props.action.type === 'update') {
    state.formData = {...props.action.data };
  } else if (props.action.type === 'create') {
    state.formData = {
      ...state.formData,
    };
  }
});

</script>

<template>
  <v-dialog v-model="dialogState" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }} User</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="state.formData.name"
            label="User Name"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="state.formData.email"
            label="Email"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="state.formData.role"
            label="Role"
            variant="outlined"
            required
          />
          <v-text-field
            v-model="state.formData.password"
            label="Password"
            type="password"
            variant="outlined"
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
