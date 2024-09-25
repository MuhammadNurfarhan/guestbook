<template>
  <v-container>
    <h1>Visitor</h1>
    <v-row>
      <v-col cols="4">
        <v-text-field label="Visitor Name" v-model="formData.visitor_name" variant="outlined" />
        <v-select :items="vendorNames" label="Vendor Name" v-model="formData.vendor_id" variant="outlined" />
        <v-select :items="vehicleTypes" label="Vehicle Type" v-model="formData.vehicle_id" variant="outlined" />
        <v-text-field label="Police Number" v-model="formData.policeNumber" variant="outlined" />
      </v-col>

      <v-col cols="4">
        <v-text-field label="Driver Name" v-model="formData.driverName" variant="outlined" />
        <v-select :items="idTypes" label="ID Type" v-model="formData.identitas_id" variant="outlined" />
        <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" />
        <v-select :items="destinateBuildings" label="Destination Building" v-model="formData.destinate_id" variant="outlined" />
        <v-text-field label="Destination PIC" v-model="formData.destination_pic" variant="outlined" />
        <v-select :items="visitorPurposes" label="Visitor Purpose" v-model="formData.purpose_id" variant="outlined" />
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
        <v-btn v-if="isEditing" variant="outlined" color="red" @click="cancelEdit">Cancel</v-btn>
        <v-btn v-else class="mr-4" color="primary" @click="saveVisitorData">Submit</v-btn>
        <v-btn variant="outlined" @click="refreshVisitorData">Refresh</v-btn>
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
            <td>{{ item.checkin_date }}</td>
            <td>{{ item.checkout_date }}</td>
            <td>{{ item.visit_no }}</td>
            <td>{{ item.visitor_name }}</td>
            <td>{{ item.vehicle_id }}</td>
            <td>{{ item.policeNumber }}</td>
            <td>{{ item.driverName }}</td>
            <td>{{ item.identitas_id }}</td>
            <td>{{ item.identitas_no }}</td>
            <td>{{ item.destinate_id }}</td>
            <td>{{ item.destination_pic }}</td>
            <td>{{ item.vendor_id }}</td>
            <td>{{ item.purpose_id }}</td>
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
              <v-btn icon @click="checkoutVisitor(item.visit_no)" v-if="!item.checkout_date">
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
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { QrcodeStream } from 'vue-qrcode-reader';
import QRCode from 'qrcode';

interface VisitorData {
  visit_no: string;
  visitor_name: string;
  vendor_id: null;
  vehicle_id: null;
  policeNumber: string;
  driverName: string;
  identitas_id: null;
  identitas_no: string;
  destinate_id: null;
  destination_pic: string;
  purpose_id: null;
  remarks: string;
  checkin_date: string;
  checkout_date: string;
  status: string;
}

interface DetectedCode {
  rawValue: string;
}

// State variables
const formData = ref<VisitorData>({
  visit_no: '',
  visitor_name: '',
  vendor_id: null,
  vehicle_id: null,
  policeNumber: '',
  driverName: '',
  identitas_id: null,
  identitas_no: '',
  destinate_id: null,
  destination_pic: '',
  purpose_id: null,
  remarks: '',
  checkin_date: '',
  checkout_date: '',
  status: '',
});

const headers = ref([
  { title: 'Checkin Date', key: 'checkin_date' },
  { title: 'Checkout Date', key: 'checkout_date' },
  { title: 'Visit Number', key: 'visit_no' },
  { title: 'Visitor Name', key: 'visitor_name' },
  { title: 'Vehicle Type', key: 'vehicle_id' },
  { title: 'Police Number', key: 'policeNumber' },
  { title: 'Driver Name', key: 'driverName' },
  { title: 'ID Type', key: 'identitas_id' },
  { title: 'ID Number', key: 'identitas_no' },
  { title: 'Destination Building', key: 'destinate_id' },
  { title: 'Destination PIC', key: 'destination_pic' },
  { title: 'Vendor Name', key: 'vendor_id' },
  { title: 'Visitor Purpose', key: 'purpose_id' },
  { title: 'Status', key: 'status' },
  { title: 'Remarks', key: 'remarks' },
  { title: 'Actions', value: 'actions', sortable: false },
]);

const visitorData = ref<VisitorData[]>([]);
const search = ref('');
const loading = ref(false);
const vendorNames = ref([]);
const vehicleTypes = ref([]);
const idTypes = ref([]);
const destinateBuildings = ref([]);
const visitorPurposes = ref([]);
const isEditing = ref(false);
const snackbar = ref({ show: false, message: '', color: 'success' });

const result = ref('');
const error = ref('');
const qrCodeUrl = ref<string | null>(null);
const cameraOpen = ref(false);

// Helper to handle API calls
const apiRequest = async (url: string, method = 'get', data: VisitorData | null = null) => {
  const token = localStorage.getItem('token');
  const config = { headers: { Authorization: `Bearer ${token}` } };

  try {
    if (method === 'get') return await axios.get(url, config);
    if (method === 'post') return await axios.post(url, data, config);
    if (method === 'put') return await axios.put(url, data, config);
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.';
    return null;
  }
};

// Fetch dropdown options (vendor, vehicle, id, destination, purposes)
const fetchDropdownOptions = async () => {
  const vendors = await apiRequest(`${import.meta.env.VITE_API_URL}/api/vendor`);
  vendorNames.value = vendors?.data?.map((vendor: { vendor_name: string }) => vendor.vendor_name) || [];

  const vehicles = await apiRequest(`${import.meta.env.VITE_API_URL}/api/vehicle`);
  vehicleTypes.value = vehicles?.data?.map((vehicle: { Vehicle_name: string }) => vehicle.Vehicle_name) || [];

  const ids = await apiRequest(`${import.meta.env.VITE_API_URL}/api/identitas`);
  idTypes.value = ids?.data?.map((id: { Identitas_name: string }) => id.Identitas_name) || [];

  const buildings = await apiRequest(`${import.meta.env.VITE_API_URL}/api/destinate`);
  destinateBuildings.value = buildings?.data?.map((building: { Destinate_name: string }) => building.Destinate_name) || [];

  const purposes = await apiRequest(`${import.meta.env.VITE_API_URL}/api/purpose`);
  visitorPurposes.value = purposes?.data?.map((purpose: { Purpose_name: string }) => purpose.Purpose_name) || [];
};

// Submit visitor data
const saveVisitorData = async () => {
  formData.value.visit_no = `VISIT_${Date.now()}`;
  formData.value.checkin_date = new Date().toLocaleString();
  const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visitor`, 'post', formData.value);

  if (res) {
    await QRCode.toDataURL(formData.value.visit_no)
      .then((url: string) => {
        qrCodeUrl.value = url;
      })
      .catch((err: Error) => {
        error.value = 'Error generating QR Code';
      });

    refreshVisitorData();
  }
};

// Fetch visitor data
const refreshVisitorData = async () => {
  loading.value = true;
  const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visitor`);
  visitorData.value = res?.data || [];
  loading.value = false;
};

// QR code scan for checkout
const onDetect = async (data: DetectedCode) => {
  result.value = data.rawValue;
  const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visit/${result.value}/checkout`, 'put');

  if (res) refreshVisitorData();
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
    const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visitor/${visit_no}`, 'delete');
    if (res) refreshVisitorData(); // Refresh the data after successful deletion
  }
};

// Checkout visitor by visit number
const checkoutVisitor = async (visit_no: string) => {
  const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visitor/${visit_no}/checkout`, 'put');
  if (res) refreshVisitorData(); // Refresh the data after successful checkout
};

// Function to update visitor data
const updateVisitorData = async () => {
  try {
    const res = await apiRequest(`${import.meta.env.VITE_API_URL}/api/visitor/${formData.value.visit_no}`, 'put', formData.value);
    if (res) {
      showSnackbar('Visitor updated successfully!', 'success');
      refreshVisitorData();
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
    visitor_name: '',
    vendor_id: null,
    vehicle_id: null,
    policeNumber: '',
    driverName: '',
    identitas_id: null,
    identitas_no: '',
    destinate_id: null,
    destination_pic: '',
    purpose_id: null,
    remarks: '',
    checkin_date: '',
    checkout_date: '',
    status: '',
  }; // Reset form
  isEditing.value = false; // Exit edit mode
};

const showSnackbar = (message: string, color: string) => {
  snackbar.value = { show: true, message, color };
};

onMounted(async () => {
  await fetchDropdownOptions();
  await refreshVisitorData();
});
</script>

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
