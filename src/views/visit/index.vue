<template>
  <v-container>
    <h1>Visitor</h1>
    <v-row>
      <v-col cols="4">
        <v-text-field label="Visitor Name" v-model="formData.visitor_name" variant="outlined" />
        <v-select
          :items="vendorNames"
          label="Vendor Name"
          v-model="formData.vendor_id"
          variant="outlined"
        />
        <v-select
          :items="vehicleTypes"
          label="Vehicle Type"
          v-model="formData.vehicle_id"
          variant="outlined"
        />
        <v-text-field label="Police Number" v-model="formData.policeNumber" variant="outlined" />
      </v-col>

      <v-col cols="4">
        <v-text-field label="Driver Name" v-model="formData.driverName" variant="outlined" />
        <v-select
          :items="idTypes"
          label="ID Type"
          v-model="formData.identitas_id"
          variant="outlined"
        />
        <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" />
        <v-select
          :items="destinateBuildings"
          label="Destination Building"
          v-model="formData.destinate_id"
          variant="outlined"
        />
        <v-text-field label="Destination PIC" v-model="formData.destination_pic" variant="outlined" />
        <v-select
          :items="visitorPurposes"
          label="Visitor Purpose"
          v-model="formData.Purpose_id"
          variant="outlined"
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
        <v-btn class="mr-4" color="primary" @click="saveVisitorData">Submit</v-btn>
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
            <v-text-field
              v-model="search"
              label="Search"
              density="compact"
              variant="outlined"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
            ></v-text-field>
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
            <td>{{ item.Purpose_id }}</td>
            <td>{{ item.status }}</td>
            <td>{{ item.remarks }}</td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
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
  Purpose_id: null;
  remarks: string;
  checkin_date: string;
  checkout_date: string;
  status: string;
}

interface DetectedCode {
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  rawValue: string;
}

// Data model for the form
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
  Purpose_id: null,
  remarks: '',
  checkin_date: '',
  checkout_date: '',
  status: '',
});

// State for visitor data
const visitorData = ref<VisitorData[]>([]);
const search = ref('');
const loading = ref(false);

// Header configuration for the data table
const headers = ref([
  { title: 'Check In', value: 'checkin_date' },
  { title: 'Check Out', value: 'checkout_date' },
  { title: 'Visitor No', value: 'visit_no' },
  { title: 'Visitor Name', value: 'visitor_name' },
  { title: 'Vehicle Type', value: 'vehicle_id' },
  { title: 'Police Number', value: 'policeNumber' },
  { title: 'Driver Name', value: 'driverName' },
  { title: 'ID Type', value: 'identitas_id' },
  { title: 'ID Number', value: 'identitas_no' },
  { title: 'Destination Building', value: 'destinate_id' },
  { title: 'Destination PIC', value: 'destination_pic' },
  { title: 'Vendor Name', value: 'vendor_id' },
  { title: 'Visitor Purpose', value: 'Purpose_id' },
  { title: 'Status', value: 'status' },
  { title: 'Note', value: 'remarks' },
]);

// data for select inputs
const vendorNames = ref([]);
const vehicleTypes = ref([]);
const idTypes = ref([]);
const destinateBuildings = ref([]);
const visitorPurposes = ref([]);

// QR code related state
const result = ref('');
const error = ref('');
const qrCodeUrl = ref<string | null>('');
const cameraOpen = ref(false);
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

// Function to open the camera for check-out
const openCameraForCheckout = () => {
  cameraOpen.value = true;
};

// Function to handle QR code detection for check-out
const onDetect = (detectedCodes: DetectedCode[]) => {
  if (debounceTimer) return;

  debounceTimer = setTimeout(() => {
    debounceTimer = null;
  }, 1000);

  result.value = detectedCodes[0].rawValue; // Assume the first detected code is the visit number

  if (result.value) {
    checkoutVisitorData(result.value); // Proceed with the checkout process
  }
};

// Error handling for the QR code scanner
function onError(err: Error) {
  error.value = `[${err.name}]: ${err.message}`;
}

// Function to fetch visitor data list from API
const getVisitorData = async () => {
  loading.value = true; // Show loading spinner
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit`);
    visitorData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  } finally {
    loading.value = false; // Hide loading spinner
  }
};

const handleApiError = (error: any) => {
  if (error.response && error.response.data && error.response.data.message) {
    alert(`Api Error: ${error.response.data.message}`);
  } else {
    alert('An error occurred. Please try again.');
  }
};

// Function to save visitor data
const saveVisitorData = async () => {
  try {
    formData.value.visit_no = `VISIT_${new Date().getTime()}`; // Generate a unique ID for each visit
    formData.value.checkin_date = new Date().toLocaleString(); // Check-in time
    formData.value.status = 'in';

    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_URL}/api/visit`, formData.value, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Push the visitor data to the visitorData array
    visitorData.value.push({ ...formData.value });

    await generateQRCode(formData.value.visit_no);
  } catch (error) {
    handleApiError(error);
  }
};

// Function to update visitor data
const checkoutVisitorData = async (visitNo: string) => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Authentication token not found');
      return;
    }

    // Fetch the visitor data using the scanned visit number
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit/${visitNo}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const visitor = response.data.data as VisitorData;

    if (visitor) {
      // Update the visitor's status to "out" and set the checkout date
      visitor.status = 'out';
      visitor.checkout_date = new Date().toLocaleString();
      cameraOpen.value = false;

      // Update the visitor data in the backend
      await axios.put(`${import.meta.env.VITE_API_URL}/api/visit/${visitNo}`, visitor, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      console.log('Visitor has checked out:', visitor);
    } else {
      console.warn('Visitor is already checked out.');
    }
  } catch (error) {
    handleApiError(error);
  } finally {
    cameraOpen.value = false; // Close the camera when done
    refreshVisitorData();
  }
};

// Function to refresh visitor data
const refreshVisitorData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit`);  // Ganti dengan URL backend Anda
    visitorData.value = response.data.data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }
};

// Function to generate QR code
const generateQRCode = async (visitNo: string) => {
  try {
    // Generate the QR code with visit number
    const qrCodeDataUrl = await QRCode.toDataURL(visitNo);
    qrCodeUrl.value = qrCodeDataUrl;  // Set the QR code URL to the ref

    // Automatically print the QR code after generation
    printQRCode();
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
};

// Function to print the QR code
const printQRCode = () => {
  const printContent = `
    <h1>Visitor QR Code</h1>
    <img src="${qrCodeUrl.value}" alt="QR Code" />
  `;
  const originalContent = document.body.innerHTML;

  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
};

const getVendorData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vendor`);
    const data = response.data.data;
    vendorNames.value = data.map((vendor: { vendor_name: string }) => vendor.vendor_name);
  } catch (error) {
    console.error('Error fetching vendor data:', error);
  }
};

const getVehicleTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/vehicle`);
    const data = response.data.data;
    vehicleTypes.value = data.map((vehicle: { Vehicle_name: string }) => vehicle.Vehicle_name);
  } catch (error) {
    console.error('Error fetching vehicle types:', error);
  }
};

const getIdTypes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/identitas`);
    const data = response.data.data;
    idTypes.value = data.map((id: { Identitas_name: string }) => id.Identitas_name);
  } catch (error) {
    console.error('Error fetching ID types:', error);
  }
};

const getDestinateBuildings = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/destinate`);
    const data = response.data.data;
    destinateBuildings.value = data.map((building: { Destinate_name: string }) => building.Destinate_name);
  } catch (error) {
    console.error('Error fetching destination buildings:', error);
  }
};

const getVisitorPurposes = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/purpose`);
    const data = response.data.data;
    visitorPurposes.value = data.map((purpose: { Purpose_name: string }) => purpose.Purpose_name);
  } catch (error) {
    console.error('Error fetching visitor purposes:', error);
  }
};

// Ambil data visitor ketika komponen dimuat
onMounted(async () => {
  await getVisitorData();
  await refreshVisitorData();
  await getVendorData();
  await getVehicleTypes();
  await getIdTypes();
  await getDestinateBuildings();
  await getVisitorPurposes();
});

</script>
