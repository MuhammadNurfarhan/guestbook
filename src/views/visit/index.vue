<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getVisitAPI, createVisitAPI, deleteVisitAPI, updateVisitAPI } from "@/api/visit/visit";
import { getVendorAPI } from '@/api/master/masterVendor';
import { getVehicleAPI } from '@/api/master/masterVehicle';
import { getIdentityAPI } from '@/api/master/masterIdentity';
import { getDestinateAPI } from '@/api/master/masterDestinate';
import { getPurposeAPI } from '@/api/master/masterPurpose';
import { useLoading } from '@/hooks';
import { ElMessageBox, ElMessage } from 'element-plus';

interface VisitorData {
  visit_id: string;
  visit_name: string;
  visit_no: string;
  vehicle_name: string;
  identitas_name: string;
  destinate_name: string;
  vendor_name: string;
  purpose_name: string;
  vendor_id: null | string;
  vehicle_id: null | string;
  vehicle_no: string;
  driver_name: string;
  identitas_id: null | string;
  identitas_no: string;
  destinate_id: null | string;
  destinate_pic: string;
  purpose_id: null | string;
  remarks: string;
  check_in: string;
  check_out: string;
  status: string;
  // img_url: string;
}

const formData = ref<VisitorData>({
  visit_id: '',
  visit_name: '',
  visit_no: '',
  vehicle_name: '',
  identitas_name: '',
  destinate_name: '',
  vendor_name: '',
  purpose_name: '',
  vendor_id: null,
  vehicle_id: null ,
  vehicle_no: '',
  driver_name: '',
  identitas_id: null,
  identitas_no: '',
  destinate_id: null,
  destinate_pic: '',
  purpose_id: null,
  remarks: '',
  check_in: '',
  check_out: '',
  status: 'Check in',
  // img_url: '',
});

const headers = ref([
  { title: 'Checkin', key: 'check_in' },
  { title: 'Checkout', key: 'check_out' },
  { title: 'Visit Number', key: 'visit_no' },
  { title: 'Visitor Name', key: 'visit_name' },
  { title: 'Vehicle Type', key: 'vehicle_name' },
  { title: 'Police Number', key: 'vehicle_no' },
  { title: 'Driver Name', key: 'driver_name' },
  { title: 'ID Type', key: 'identitas_name' },
  { title: 'ID Number', key: 'identitas_no' },
  { title: 'Destination Building', key: 'destinate_name' },
  { title: 'Destination PIC', key: 'destinate_pic' },
  { title: 'Vendor Name', key: 'vendor_id' },
  { title: 'Visitor Purpose', key: 'purpose_id' },
  { title: 'Status', key: 'status' },
  { title: 'Remarks', key: 'remarks' },
  { title: 'Actions', key: 'actions' },
]);

const visitorData = ref<VisitorData[]>([]);
const search = ref('');
const isEditing = ref(false);
const { loading, showLoading, hideLoading } = useLoading();
const dropdownOptions = ref({
  vendors: [],
  vehicles: [],
  idTypes: [],
  destinateBuildings: [],
  purposes: [],
});

const error = ref('');
// const img_url = ref<string | null>(null);

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
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  }
};

const getVisitorData = async () => {
  showLoading();
  try {
    const today = await new Date();
    const res = await getVisitAPI(today)
    visitorData.value = res?.data || [];
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  } finally {
    hideLoading();
  }
};

const submitVisitorData = async (payload: VisitorData) => {
  try {
    let response;
    if (isEditing.value && formData.value) {
      response = await updateVisitAPI(formData.value.visit_id, payload);
    } else {
      response = await createVisitAPI(payload);
    }
    await getVisitorData();
    cancelEdit();

    // Return the response to capture in handleSubmit
    return response;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.';
  }
};

const editVisitor = (item: any) => {
  isEditing.value = true;
  formData.value = item;
};

const deleteVisitor = async (item: any) => {
  ElMessageBox.confirm(("Are you sure you want to delete this visitor?"), ("Delete Visitor"), {
    confirmButtonText: ("Delete"),
    cancelButtonText: ("Cancel"),
    type: "warning",
  }).then(() => {
    deleteVisitAPI(item).then(() => {
      getVisitorData();
    });
  });
};

const checkoutVisitor = async (item: any) => {
  try {
    // Update the status to 'Check out' and set the check_out time
    const updatedData = {
      ...item,
      status: 'Check out',
      check_out: new Date().toISOString(),
    };

    // Call the API to update the visitor data
    await updateVisitAPI(item.visit_id, updatedData);

    // Reload the visitor data to reflect changes
    await getVisitorData();

    ElMessage({
      message: 'Checkout successful!',
      type: 'success',
    });
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred during checkout.';
  }
};

const cancelEdit = () => {
  formData.value = null; // Reset form
  isEditing.value = false; // Exit edit mode
};

const handleSubmit = async () => {
  try {
    await submitVisitorData(formData.value);  // Call API and capture response
  } catch (err) {
    console.error("Error in handleSubmit:", err);
  }
};


onMounted(async () => {
  await fetchDropdownOptions();
  await getVisitorData();
});

onBeforeMount(() => {
  getVisitorData();
});
</script>

<template>
  <Parent-card title="Visitor" v-loading="loading">
    <v-row>
      <v-col cols="12">
        <v-form @submit.prevent="handleSubmit">
          <v-row>
            <v-col cols="6">
              <v-text-field label="Visitor Name" v-model="formData.visit_name" variant="outlined" />
              <v-select
                v-model="formData.vendor_id"
                :items="dropdownOptions.vendors"
                item-title="vendor_name"
                item-value="vendor_id"
                label="Vendor Name"
                variant="outlined"
              />
              <v-select
                v-model="formData.vehicle_id"
                :items="dropdownOptions.vehicles"
                item-title="vehicle_name"
                item-value="vehicle_id"
                label="Vehicle Type"
                variant="outlined"
              />
              <v-text-field label="Police Number" v-model="formData.vehicle_no" variant="outlined" />
            </v-col>

            <v-col cols="6">
              <v-text-field label="Driver Name" v-model="formData.driver_name" variant="outlined" />
              <v-select
                v-model="formData.identitas_id"
                :items="dropdownOptions.idTypes"
                item-title="identitas_name"
                item-value="identitas_id"
                label="ID Type"
                variant="outlined"
              />
              <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" />
              <v-select
                v-model="formData.destinate_id"
                :items="dropdownOptions.destinateBuildings"
                item-title="destinate_name"
                item-value="destinate_id"
                label="Destination Building"
                variant="outlined"
                />
              <v-text-field label="Destination PIC" v-model="formData.destinate_pic" variant="outlined" />
              <v-select
                v-model="formData.purpose_id"
                :items="dropdownOptions.purposes"
                item-title="purpose_name"
                item-value="purpose_id"
                label="Visitor Purpose"
                variant="outlined"
              />
              <v-text-field label="Notes" v-model="formData.remarks" variant="outlined" />
            </v-col>
          </v-row>
          <v-row class="mb-5">
            <v-col cols="6">
              <v-btn v-if="!isEditing " class="mr-4" color="primary" type="submit">Submit</v-btn>
              <v-btn v-else class="mr-4" color="primary" type="submit">Update</v-btn>
              <v-btn class="mr-4" color="red" @click="cancelEdit">Cancel</v-btn>
              <v-btn class="mr-4" variant="outlined" @click="getVisitorData">Refresh</v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <!-- Visitor Data -->
    <v-card flat>
      <v-card-title>
        <v-row>
          <v-col cols="10">
            <h2>Visitor Data</h2>
          </v-col>
          <v-col cols="2" class="text-right">
            <v-text-field v-model="search" label="Search" density="compact" variant="outlined" prepend-inner-icon="mdi-magnify" hide-details single-line />
          </v-col>
        </v-row>
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="visitorData"
        :search="search"
        :loading="loading"
        loading-text="Loading user data..."
        class="elevation-1"
        style="overflow-x: auto; white-space: nowrap"
      >
        <template v-slot:item="{ item }">
          <tr>
            <td>{{ item.check_in }}</td>
            <td>{{ item.check_out }}</td>
            <td>{{ item.visit_no }}</td>
            <td>{{ item.visit_name }}</td>
            <td>{{ item.vehicle_name }}</td>
            <td>{{ item.vehicle_no }}</td>
            <td>{{ item.driver_name }}</td>
            <td>{{ item.identitas_name }}</td>
            <td>{{ item.identitas_no }}</td>
            <td>{{ item.destinate_name }}</td>
            <td>{{ item.destinate_pic }}</td>
            <td>{{ item.vendor_name }}</td>
            <td>{{ item.purpose_name }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.remarks }}</td>

            <!-- Action Buttons -->
            <td>
              <v-btn icon @click="editVisitor(item)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click="deleteVisitor(item)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="checkoutVisitor(item)" v-if="item.status === 'Check in'">
                <v-icon color="green">mdi-check-circle</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Error Display -->
    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
  </Parent-card>
</template>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
