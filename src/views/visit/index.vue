<template>
  <v-container>
    <h1>Visitor</h1>
    <v-row>
      <v-col cols="4">
        <v-text-field label="Visitor Name" v-model="formData.visitorName" variant="outlined" />
        <v-select
          :items="vendorNames"
          label="Vendor Name"
          v-model="formData.vendorName"
          variant="outlined"
        />
        <v-select
          :items="vehicleTypes"
          label="Vehicle Type"
          v-model="formData.vehicleType"
          variant="outlined"
        />
        <v-text-field label="Police Number" v-model="formData.policeNumber" variant="outlined" />
        <v-radio-group row label="Visit Status">
          <v-radio
            label="In"
            value="in"
            v-model="formData.inOrOut"
          />
          <v-radio
            label="Out"
            value="out"
            v-model="formData.inOrOut"
          />
        </v-radio-group>
      </v-col>

      <v-col cols="4">
        <v-text-field label="Driver Name" v-model="formData.driverName" variant="outlined" />
        <v-select
          :items="idTypes"
          label="ID Type"
          v-model="formData.idType"
          variant="outlined"
        />
        <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" />
        <v-select
          :items="destinateBuildings"
          label="Destination Building"
          v-model="formData.destinateBuilding"
          variant="outlined"
        />
        <v-text-field label="Destination PIC" v-model="formData.destinatePic" variant="outlined" />
        <v-select
          :items="visitorPurposes"
          label="Visitor Purpose"
          v-model="formData.visitorPurpose"
          variant="outlined"
        />
        <v-text-field label="Remark" v-model="formData.remarks" variant="outlined" />
      </v-col>

      <v-col cols="4">
        <!-- QR Code Reader -->
        <p style="color: red">{{ error }}</p>
        <p>Last result: <b>{{ result }}</b></p>
        <div style="border: 2px solid black">
          <qrcode-stream :track="paintBoundingBox" @detect="onDetect" @error="onError"></qrcode-stream>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-btn @click="saveVisitorData">Save</v-btn>
        <v-btn @click="updateVisitorData">Update</v-btn>
        <v-btn @click="refreshVisitorData">Refresh</v-btn>
      </v-col>
    </v-row>

    <h2>Visitor Data</h2>
    <v-data-table :headers="headers" :items="visitorData" class="elevation-1">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.checkin_date }}</td>
          <td>{{ item.checkout_date }}</td>
          <td>{{ item.visit_no }}</td>
          <td>{{ item.visitorName }}</td>
          <td>{{ item.vehicleType }}</td>
          <td>{{ item.policeNumber }}</td>
          <td>{{ item.driverName }}</td>
          <td>{{ item.idType }}</td>
          <td>{{ item.identitas_no }}</td>
          <td>{{ item.destinateBuilding }}</td>
          <td>{{ item.vendorName }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { QrcodeStream } from 'vue-qrcode-reader';

interface VisitorData {
  visit_no: string;
  visitorName: string;
  vendorName: null;
  vehicleType: null;
  policeNumber: string;
  driverName: string;
  idType: null;
  identitas_no: string;
  destinateBuilding: null;
  destinatePic: string;
  visitorPurpose: null;
  remarks: string;
  inOrOut: string;
  checkin_date: string;
  checkout_date: string;
  img_url: string;
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
  visitorName: '',
  vendorName: null,
  vehicleType: null,
  policeNumber: '',
  driverName: '',
  idType: null,
  identitas_no: '',
  destinateBuilding: null,
  destinatePic: '',
  visitorPurpose: null,
  remarks: '',
  inOrOut: '',
  checkin_date: '',
  checkout_date: '',
  img_url: '',
  status: '',
});

// State for visitor data
const visitorData = ref<VisitorData[]>([]);  // Initially empty

// Header configuration for the data table
const headers = ref([
  { title: 'Check In', value: 'checkin_date' },
  { title: 'Check Out', value: 'checkout_date' },
  { title: 'Visitor No', value: 'visit_no' },
  { title: 'Visitor Name', value: 'visitorName' },
  { title: 'Vehicle Type', value: 'vehicleType' },
  { title: 'Police Number', value: 'policeNumber' },
  { title: 'Driver Name', value: 'driverName' },
  { title: 'ID Type', value: 'idType' },
  { title: 'ID Number', value: 'identitas_no' },
  { title: 'Destination Building', value: 'destinationBuilding' },
  { title: 'Vendor Name', value: 'vendorName' },
  { title: 'Image', value: 'img_url' },
  { title: 'Status', value: 'status' },
]);

// QR code related state
const result = ref('');
const error = ref('');

function paintBoundingBox(detectedCodes: DetectedCode[], ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const { boundingBox: { x, y, width, height } } = detectedCode;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#007bff';
    ctx.strokeRect(x, y, width, height);
  }
}

function onDetect(detectedCodes: DetectedCode[]) {
  result.value = JSON.stringify(detectedCodes.map(code => code.rawValue));
}

function onError(err: Error) {
  error.value = `[${err.name}]: ${err.message}`;
}

// Function to fetch visitor data list from API
const getVisitorData = async () => {
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit`);
    const data = response.data.data;
    visitorData.value = data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
  }
};

// Function to save visitor data
const saveVisitorData = () => {
  formData.value.visit_no = '2311020003';  // Assign a new ID (could be dynamic)
  formData.value.checkin_date = new Date().toLocaleString(); // Check-in time
  visitorData.value.push({ ...formData.value });
  console.log('Visitor data saved:', formData.value);
};

// Function to update visitor data
const updateVisitorData = () => {
  const index = visitorData.value.findIndex(visitor => visitor.visit_no === formData.value.visit_no);
  if (index !== -1) {
    visitorData.value[index] = { ...formData.value };
    console.log('Visitor data updated:', formData.value);
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
  await refreshVisitorData();  // Panggil fungsi untuk mengambil data dari backend
  await getVendorData();
  await getVehicleTypes();
  await getIdTypes();
  await getDestinateBuildings();
  await getVisitorPurposes();
});

// data for select inputs
const vendorNames = ref([]);
const vehicleTypes = ref([]);
const idTypes = ref([]);
const destinateBuildings = ref([]);
const visitorPurposes = ref([]);
</script>
