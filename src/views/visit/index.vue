<template>
  <Parent-card title="Visitor Form" v-loading="loading">
    <v-form ref="form" :model="formData">
      <v-row>
        <v-col cols="4">
          <v-text-field label="Visitor Name" v-model="formData.visit_name" variant="outlined" :rules="[rules.required]" />
          <v-select
            v-model="formData.selectedVendor"
            :items="vendors"
            item-title="vendor_name"
            item-value="vendor_id"
            label="Vendor Name"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-select
            v-model="formData.selectedVehicle"
            :items="vehicles"
            item-title="vehicle_name"
            item-value="vehicle_id"
            label="Vehicle Type"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-text-field label="Police Number" v-model="formData.vehicle_no" variant="outlined" :rules="[rules.required]" />
        </v-col>

        <v-col cols="4">
          <v-text-field label="Driver Name" v-model="formData.driver_name" variant="outlined" :rules="[rules.required]" />
          <v-select
            v-model="formData.selectedIdType"
            :items="idTypes"
            item-title="identitas_name"
            item-value="identitas_id"
            label="ID Type"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" :rules="[rules.required]" />
          <v-select
            v-model="formData.selectedDestinateBuilding"
            :items="destinateBuildings"
            item-title="destinate_name"
            item-value="destinate_id"
            label="Destination Building"
            variant="outlined"
            :rules="[rules.required]" />
          <v-text-field label="Destination PIC" v-model="formData.destinate_pic" variant="outlined" :rules="[rules.required]" />
          <v-select
            v-model="formData.selectedVisitorPurpose"
            :items="visitorPurposes"
            item-title="purpose_name"
            item-value="purpose_id"
            label="Visitor Purpose"
            variant="outlined"
            :rules="[rules.required]"
          />
          <v-text-field label="Notes" v-model="formData.remarks" variant="outlined" />
        </v-col>

        <v-col cols="4">
          <!-- Button to Open Camera for Checkout -->
          <v-btn color="green" @click="openCameraForCheckout">Checkout with QR Code</v-btn>

          <!-- QR Code Reader, visible only when `cameraOpen` is true -->
          <div v-if="cameraOpen" style="border: 2px solid black; margin-top: 10px;">
            <p style="color: red">{{ error }}</p>
            <p>Last result: <b>{{ result }}</b></p>
            <qrcode-stream @detect="onDetect" @error="onError" />
          </div>

          <!-- QR Code Display -->
          <div v-if="qrCodeUrl">
            <h2>Visitor QR Code</h2>
            <p v-if="result">Scanned Visit Number: {{ result }}</p>
            <p v-if="error" style="color: red">{{ error }}</p>
            <img :src="qrCodeUrl" alt="Visitor QR Code" />
          </div>
        </v-col>
      </v-row>

      <v-row class="mb-5">
        <v-col cols="6">
          <v-btn v-if="isEditing" class="mr-4" color="primary" @click="updateVisitorData">Update</v-btn>
          <v-btn v-if="isEditing" class="mr-4" color="red" @click="cancelEdit">Cancel</v-btn>
          <v-btn v-else class="mr-4" color="primary" :disabled="!$refs.form" @click="submitVisitorData">Submit</v-btn>
          <v-btn variant="outlined" @click="getVisitorData">Refresh</v-btn>
        </v-col>
      </v-row>
    </v-form>

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
              <v-btn icon @click="deleteVisitor(item.visit_no)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="checkoutVisitor(item.visit_no)" v-if="!item.check_out">
                <v-icon color="green">mdi-check</v-icon>
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>

    <!-- Error Display -->
    <v-alert v-if="error" type="error" dismissible>{{ error }}</v-alert>
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </Parent-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { QrcodeStream } from 'vue-qrcode-reader';
import QRCode from 'qrcode';
import { getVisitAPI, createVisitAPI, deleteVisitAPI, updateVisitAPI } from "@/api/visit/visit";
import { getVendorAPI } from '@/api/master/masterVendor';
import { getVehicleAPI } from '@/api/master/masterVehicle';
import { getIdentityAPI } from '@/api/master/masterIdentity';
import { getDestinateAPI } from '@/api/master/masterDestinate';
import { getPurposeAPI } from '@/api/master/masterPurpose';
import { useLoading } from '@/hooks';

interface VisitorData {
  visit_no: string;
  visit_name: string;
  vehicle_name: string;
  identitas_name: string;
  destinate_name: string;
  vendor_name: string;
  purpose_name: string;
  selectedVendor: null | string;
  selectedVehicle: null | string;
  vehicle_no: string;
  driver_name: string;
  selectedIdType: null | string;
  identitas_no: string;
  selectedDestinateBuilding: null | string;
  destinate_pic: string;
  selectedVisitorPurpose: null | string;
  remarks: string;
  check_in: string;
  check_out: string;
  status: string;
}

interface DetectedCode {
  rawValue: string;
}

// State variables
const formData = ref<VisitorData>({
  visit_no: '',
  visit_name: '',
  vehicle_name: '',
  identitas_name: '',
  destinate_name: '',
  vendor_name: '',
  purpose_name: '',
  selectedVendor: null,
  selectedVehicle: null ,
  vehicle_no: '',
  driver_name: '',
  selectedIdType: null,
  identitas_no: '',
  selectedDestinateBuilding: null,
  destinate_pic: '',
  selectedVisitorPurpose: null,
  remarks: '',
  check_in: '',
  check_out: '',
  status: '',
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
const vendors = ref([]);
const vehicles = ref([]);
const idTypes = ref([]);
const destinateBuildings = ref([]);
const visitorPurposes = ref([]);
const isEditing = ref(false);
const snackbar = ref({ show: false, message: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();
const rules = {
  required: (value: string) => !!value || 'Field is required',
};

const result = ref('');
const error = ref('');
const qrCodeUrl = ref<string | null>(null);
const cameraOpen = ref(false);

// Fetch dropdown options (vendor, vehicle, idtype, destination, purposes)
const fetchDropdownOptions = async () => {
  try {
    const vendorResponse = await getVendorAPI();
    console.log(vendorResponse.data);
    vendors.value = vendorResponse.data;
    const vehicleResponse = await getVehicleAPI();
    vehicles.value = vehicleResponse.data;
    const idTypeResponse = await getIdentityAPI();
    idTypes.value = idTypeResponse.data;
    const destinateBuildingResponse = await getDestinateAPI();
    destinateBuildings.value = destinateBuildingResponse.data;
    const visitorPurposeResponse = await getPurposeAPI();
    visitorPurposes.value = visitorPurposeResponse.data;
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  }
};

// Submit visitor data
const submitVisitorData = async () => {
  const res = await createVisitAPI(formData.value);
  formData.value = res.data;

  if (res) {
    await QRCode.toDataURL(formData.value.visit_no)
      .then((url: string) => {
        qrCodeUrl.value = url;
      })
      .catch((err: Error) => {
        error.value = 'Error generating QR Code';
      });

    getVisitorData();
  }
};

// get visitor data
const getVisitorData = async () => {
  showLoading();
  try {
    const today = await new Date();
    const res = await getVisitAPI(today)
    visitorData.value = await res?.data || [];
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  } finally {
    hideLoading();
  }
};

// QR code scan for checkout
const onDetect = async (data: DetectedCode) => {
  result.value = data.rawValue;

  const payload = {
    visit_no: result.value,
    status: 'checked_out',
    checkout_time: new Date().toISOString()
  };

  const res = await updateVisitAPI(payload);

  if (res) {
    getVisitorData();
    showSnackbar('Checkout successful', 'success');
  } else {
    showSnackbar('Checkout failed', 'error');
  }
};

// QR code scan error
const onError = (err: Error) => {
  error.value = `QR Code Error: ${err.message}`;
};

// Open camera for QR code checkout
const openCameraForCheckout = () => {
  cameraOpen.value = !cameraOpen.value;
  error.value = '';
};

const editVisitor = (item: VisitorData) => {
  formData.value = { ...item };
  isEditing.value = true;
};

const deleteVisitor = async (visit_no: string) => {
  if (confirm('Are you sure you want to delete this visitor?')) {
    const res = await deleteVisitAPI(visit_no);
    if (res) getVisitorData(); // Refresh the data after successful deletion
  }
};

// Checkout visitor by visit number
const checkoutVisitor = async (visit_no: string) => {
  try {
    const payload = {
      visit_no: visit_no,
      status: 'checked_out',
      checkout_time: new Date().toISOString()
    }

    const res = await updateVisitAPI(payload);

    if (res) {
      getVisitorData();
      showSnackbar('Checkout berhasil', 'success');
    } else {
      showSnackbar('Checkout gagal', 'error');
    }
  } catch (error) {
    console.error('Error saat checkout:', error);
  }
};

// Function to update visitor data
const updateVisitorData = async () => {
  try {
    const res = await updateVisitAPI(formData.value.visit_no);

    if (res) {
      formData.value = res.data;
      showSnackbar('Visitor updated successfully!', 'success');
      getVisitorData();
      cancelEdit();
    } else {
      showSnackbar('Error updating visitor', 'error');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  }
};

// Function to cancel the editing process
const cancelEdit = () => {
  formData.value = {
    visit_no: '',
    visit_name: '',
    vendor_name: '',
    vehicle_name: '',
    identitas_name: '',
    destinate_name: '',
    purpose_name: '',
    selectedVendor: null,
    selectedVehicle: null ,
    vehicle_no: '',
    driver_name: '',
    selectedIdType: null,
    identitas_no: '',
    selectedDestinateBuilding: null,
    destinate_pic: '',
    selectedVisitorPurpose: null,
    remarks: '',
    check_in: '',
    check_out: '',
    status: '',
  }; // Reset form
  isEditing.value = false; // Exit edit mode
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color };
};

onMounted(async () => {
  await getVisitorData();
  await fetchDropdownOptions();
});

onBeforeMount(() => {
  getVisitorData();
});
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
