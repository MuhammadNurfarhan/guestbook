<script setup lang="ts">
import { createVisitAPI, updateVisitAPI } from '@/api/visit/visit';
import { getVendorAPI } from '@/api/master/masterVendor';
import { getVehicleAPI } from '@/api/master/masterVehicle';
import { getIdentityAPI } from '@/api/master/masterIdentity';
import { getDestinateAPI } from '@/api/master/masterDestinate';
import { getPurposeAPI } from '@/api/master/masterPurpose';

const props = defineProps({
  showDialog: Boolean,
  action: Object,
});

const emit = defineEmits(['close']);
const dropdownOptions = ref({
  vendors: [],
  vehicles: [],
  idTypes: [],
  destinateBuildings: [],
  purposes: [],
});

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
    'visit_name': '',
    'visit_no': '',
    'vehicle_id': '',
    'identitas_id': '',
    'destinate_id': '',
    'vendor_id': '',
    'purpose_id': '',
    'vehicle_no': '',
    'driver_name': '',
    'identitas_no': '',
    'destinate_pic': '',
    'remarks': '',
    'check_in': '',
    'check_out': '',
    'visit_id': null,
    'status': 'Check in',
    // img_url: '',
  },
});

const fetchDropdownOptions = async () => {
  try {
    const vendorResponse = await getVendorAPI();
    dropdownOptions.value.vendors = vendorResponse.data;
    const vehicleResponse = await getVehicleAPI();
    dropdownOptions.value.vehicles = vehicleResponse.data;
    const identityResponse = await getIdentityAPI();
    dropdownOptions.value.idTypes = identityResponse.data;
    const destinateResponse = await getDestinateAPI();
    dropdownOptions.value.destinateBuildings = destinateResponse.data;
    const purposeResponse = await getPurposeAPI();
    dropdownOptions.value.purposes = purposeResponse.data;
  } catch (err: any) {
    err.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  }
};

const handleCancelClick = () => {
  emit('close');
};

const handleSaveClick = () => {
  const request =
    props.action.type === "create"
      ? createVisitAPI
      : updateVisitAPI;

  request(state.formData).then(() => {
    emit('close');
  });
};

onMounted(async () => {
  await fetchDropdownOptions();
});

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
  <v-dialog v-model="dialogState" max-width="900px">
    <v-card>
      <v-card-title>{{ dialogTitle }} Visit</v-card-title>
      <v-divider />
      <v-card-text>
        <v-form>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Visitor Name" v-model="state.formData.visit_name" variant="outlined" />
              <v-select
                v-model="state.formData.vendor_id"
                :items="dropdownOptions.vendors"
                item-title="vendor_name"
                item-value="vendor_id"
                label="Vendor Name"
                variant="outlined"
              />
              <v-select
                v-model="state.formData.vehicle_id"
                :items="dropdownOptions.vehicles"
                item-title="vehicle_name"
                item-value="vehicle_id"
                label="Vehicle Type"
                variant="outlined"
              />
              <v-text-field label="Police Number" v-model="state.formData.vehicle_no" variant="outlined" />
            </v-col>

            <v-col cols="6">
              <v-text-field label="Driver Name" v-model="state.formData.driver_name" variant="outlined" />
              <v-select
                v-model="state.formData.identitas_id"
                :items="dropdownOptions.idTypes"
                item-title="identitas_name"
                item-value="identitas_id"
                label="ID Type"
                variant="outlined"
              />
              <v-text-field label="ID Number" v-model="state.formData.identitas_no" variant="outlined" type="number" />
              <v-select
                v-model="state.formData.destinate_id"
                :items="dropdownOptions.destinateBuildings"
                item-title="destinate_name"
                item-value="destinate_id"
                label="Destination Building"
                variant="outlined"
              />
              <v-text-field label="Destination PIC" v-model="state.formData.destinate_pic" variant="outlined" />
              <v-select
                v-model="state.formData.purpose_id"
                :items="dropdownOptions.purposes"
                item-title="purpose_name"
                item-value="purpose_id"
                label="Visitor Purpose"
                variant="outlined"
              />
              <v-text-field label="Notes" v-model="state.formData.remarks" variant="outlined" />
            </v-col>
          </v-row>
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
