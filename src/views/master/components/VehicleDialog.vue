<script setup lang="ts">
import { ref, defineProps, watch } from 'vue';

const props = defineProps<{
  show: boolean;
  editMode: boolean;
  editedVehicle: Vehicle | null;
}>();

interface Vehicle {
  vehicle_id: string;
  vehicle_name: string;
  vehicle_desc: string;
}

const localVehicle = ref<Vehicle>({
  vehicle_id: '',
  vehicle_name: '',
  vehicle_desc: '',
});

const dialogTitle = ref('Create Vehicle Type');
const emit = defineEmits(['save', 'cancel']);

watch(() => props.editMode, (newVal) => {
  dialogTitle.value = newVal ? 'Edit Vehicle Type' : 'Create Vehicle Type';
});

watch(() => props.editedVehicle, (newVehicle) => {
  if (newVehicle) {
    localVehicle.value = { ...newVehicle };
  } else {
    localVehicle.value = {
      vehicle_id: '',
      vehicle_name: '',
      vehicle_desc: '',
    };
  }
});

const save = () => {
  emit('save', localVehicle.value);
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
            v-model="localVehicle.vehicle_name"
            label="Vehicle Name"
            variant="outlined"
            required
          />
          <v-textarea
            v-model="localVehicle.vehicle_desc"
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
