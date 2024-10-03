<script setup lang="ts">
import { createVendorAPI, updateVendorAPI } from '@/api/master/masterVendor';

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
  return props.action.type === 'create' ? 'create' : 'update';
});

const state = reactive({
  formData: {
    vendor_id: '',
    vendor_name: '',
    vendor_desc: '',
  },
});

const handleCancelClick = () => {
  emit('close');
};

const handleSaveClick = () => {
  const request =
    props.action.type === "create"
      ? createVendorAPI
      : updateVendorAPI;

  request(state.formData).then(() => {
    emit('close');
  });
};

</script>

<template>
  <v-dialog v-model="dialogState" max-width="600px">
    <v-card>
      <v-card-title>{{ dialogTitle }} Vendor</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="state.formData.vendor_name"
            label="Vendor Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="state.formData.vendor_desc"
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
