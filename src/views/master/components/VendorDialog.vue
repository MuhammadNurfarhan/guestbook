<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  editedVendor: Vendor | null;
}>();

interface Vendor {
  vendor_id: string;
  vendor_name: string;
  vendor_desc: string;
}

const localVendor = ref<Vendor>({
  vendor_id: '',
  vendor_name: '',
  vendor_desc: '',
});

const dialogTitle = ref('Create Vendor');
const emit = defineEmits(['save', 'cancel']);

// Watch perubahan editMode atau editedVendor untuk menyesuaikan form dan judul
watch(() => props.editMode, (newVal) => {
  dialogTitle.value = newVal ? 'Edit Vendor' : 'Create Vendor';
});

watch(() => props.editedVendor, (newVendor) => {
  if (newVendor) {
    localVendor.value = { ...newVendor };
  } else {
    // Reset form jika tidak ada vendor yang di-edit
    localVendor.value = {
      vendor_id: '',
      vendor_name: '',
      vendor_desc: '',
    };
  }
});

const save = () => {
  // Emit event save dan kirim data vendor lokal
  emit('save', localVendor.value);
};

const cancel = () => {
  // Emit event cancel untuk menutup dialog
  emit('cancel');
};
</script>

<template>
  <v-dialog v-model="props.show" max-width="600px">
    <v-card>
      <v-card-title>
        {{ dialogTitle }}
      </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
            v-model="localVendor.vendor_name"
            label="Vendor Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="localVendor.vendor_desc"
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
