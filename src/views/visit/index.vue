<template>
  <v-container>
    <h1>Visitor</h1>
    <v-row>
      <v-col cols="4">
        <v-text-field label="Visitor Name" v-model="formData.Visitor_name" variant="outlined" />
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
          <qrcode-stream @detect="onDetect" @error="onError" />
        </div>

        <!-- QR Code Display -->
        <div v-if="qrCodeUrl">
          <h2>Visitor QR Code</h2>
          <p v-if="result">Scanned Visit Number: {{ result }}</p>
          <p v-if="error" style="color: red">{{ error }}</p>
          <img :src="qrCodeUrl" alt="Visitor QR Code" />
        </div>

        <!-- Camera Integration -->
        <v-btn color="green" class="mt-4" @click="openCamera">Take Photo</v-btn>
        <img v-if="formData.img_url" :src="formData.img_url" alt="Visitor Photo" width="100" />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="6">
        <v-btn class="mr-4" color="primary" @click="saveVisitorData">Save & Print QR</v-btn>
        <v-btn class="mr-4" color="error" @click="checkoutVisitorData">Checkout</v-btn>
        <v-btn variant="outlined" @click="refreshVisitorData">Refresh</v-btn>
      </v-col>
    </v-row>

    <h2>Visitor Data</h2>
    <v-data-table :headers="headers" :items="visitorData" class="elevation-1">
      <template v-slot:item="{ item }">
        <tr>
          <td>{{ item.checkin_date }}</td>
          <td>{{ item.checkout_date }}</td>
          <td>{{ item.visit_no }}</td>
          <td>{{ item.Visitor_name }}</td>
          <td>{{ item.vehicle_id }}</td>
          <td>{{ item.policeNumber }}</td>
          <td>{{ item.driverName }}</td>
          <td>{{ item.identitas_id }}</td>
          <td>{{ item.identitas_no }}</td>
          <td>{{ item.destinate_id }}</td>
          <td>{{ item.vendor_id }}</td>
          <td><img :src="item.img_url" alt="Visitor Photo" width="100" /></td>
          <td>{{ item.status }}</td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { QrcodeStream } from 'vue-qrcode-reader';
import QRCode from 'qrcode';

interface VisitorData {
  visit_no: string;
  Visitor_name: string;
  vendor_id: null;
  vehicle_id: null;
  policeNumber: string;
  driverName: string;
  identitas_id: null;
  identitas_no: string;
  destinate_id: null;
  destinatePic: string;
  visitorPurpose: null;
  remarks: string;
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
  Visitor_name: '',
  vendor_id: null,
  vehicle_id: null,
  policeNumber: '',
  driverName: '',
  identitas_id: null,
  identitas_no: '',
  destinate_id: null,
  destinatePic: '',
  visitorPurpose: null,
  remarks: '',
  checkin_date: '',
  checkout_date: '',
  img_url: '',
  status: '',
});

// State for visitor data
const visitorData = ref<VisitorData[]>([]);

// Header configuration for the data table
const headers = ref([
  { title: 'Check In', value: 'checkin_date' },
  { title: 'Check Out', value: 'checkout_date' },
  { title: 'Visitor No', value: 'visit_no' },
  { title: 'Visitor Name', value: 'Visitor_name' },
  { title: 'Vehicle Type', value: 'vehicle_id' },
  { title: 'Police Number', value: 'policeNumber' },
  { title: 'Driver Name', value: 'driverName' },
  { title: 'ID Type', value: 'identitas_id' },
  { title: 'ID Number', value: 'identitas_no' },
  { title: 'Destination Building', value: 'destinate_id' },
  { title: 'Vendor Name', value: 'vendor_id ' },
  { title: 'Image', value: 'img_url' },
  { title: 'Status', value: 'status' },
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
const qrCodeUrl = ref<string>('');

// Function to handle QR code detection for check-out
const onDetect = (detectedCodes: DetectedCode[]) => {
  result.value = detectedCodes[0].rawValue; // Assume the first detected code is the visit number
  console.log('Scanned QR Code:', result.value);

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
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/visit`);
    const data = response.data.data;
    visitorData.value = data;
  } catch (error) {
    console.error('Error fetching visitor data:', error);
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
    console.log('Visitor data saved:', formData.value);

    await generateQRCode(formData.value.visit_no);
  } catch (error) {
    console.error('Error saving visitor data:', error);
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
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    // Write the QR code into a new document
    printWindow.document.write(`
      <html>
        <head><title>Print QR Code</title></head>
        <body>
          <h1>Visitor QR Code</h1>
          <img src="${qrCodeUrl.value}" alt="QR Code" />
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          <\/script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }
};

// Function to update visitor data
const checkoutVisitorData = async (visitNo: string) => {
  try {
    const token = localStorage.getItem('authToken');
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

    if (visitor.status === 'in') {
      // Update the visitor's status to "out" and set the checkout date
      visitor.status = 'out';
      visitor.checkout_date = new Date().toLocaleString();
      visitor.status = 'out'; // Mark visitor as checked out

      // Update the visitor data in the backend
      await axios.put(`${import.meta.env.VITE_API_URL}/api/visit/${visitNo}`, visitor, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      console.log('Visitor has checked out:', visitor);
    } else {
      console.warn('Visitor is already checked out.');
    }
  } catch (error) {
    console.error('Error during checkout:', error);
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

const openCamera = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.play();

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    // Create a dialog to display the video stream
    const dialog = document.createElement('div');
    dialog.appendChild(videoElement);
    document.body.appendChild(dialog);

    // Capture the image after user interaction
    videoElement.addEventListener('click', () => {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      context?.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL('image/png');
      savePhoto(imageData);
      stream.getTracks().forEach(track => track.stop());
      document.body.removeChild(dialog);
    });
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
};

const savePhoto = async (imageData: string) => {
  try {
    // Convert base64 data to a Blob
    const blob = await (await fetch(imageData)).blob();
    const formData = new FormData();
    formData.append('photo', blob);

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload-photo`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Save the returned img_url from the response to formData
    const photoData = {
      img_url: response.data.img_url,
    }
    console.log('Photo uploaded successfully:', photoData.img_url);
  } catch (error) {
    console.error('Error uploading photo:', error);
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
