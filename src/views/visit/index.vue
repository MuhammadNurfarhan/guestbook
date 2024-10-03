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
  visit_name: string;
  // vehicle_name: string;
  // identitas_name: string;
  // destinate_name: string;
  // vendor_name: string;
  // purpose_name: string;
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
  check_out: null | string;
  status: string;
  // img_url: string;
}

interface DetectedCode {
  rawValue: string;
}

const formData = ref<VisitorData>({
  visit_name: '',
  // vehicle_name: '',
  // identitas_name: '',
  // destinate_name: '',
  // vendor_name: '',
  // purpose_name: '',
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
  check_out: null,
  status: '',
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
const snackbar = ref({ show: false, message: '', color: 'success' });
const { loading, showLoading, hideLoading } = useLoading();
const dropdownOptions = ref({
  vendors: [],
  vehicles: [],
  idTypes: [],
  destinateBuildings: [],
  purposes: [],
});

const result = ref('');
const error = ref('');
const qrCodeUrl = ref<string | null>(null);
const cameraOpen = ref(false);
const img_url = ref<string | null>(null);
const video = ref<HTMLVideoElement | null>(null);

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

const capturePhoto = async () => {
  try {
    const video = document.createElement("video");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    video.play();

    // Take a snapshot after 1 second
    setTimeout(() => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas image to base64
      img_url.value = canvas.toDataURL("image/png");

      // Stop the camera
      stream.getTracks().forEach((track) => track.stop());
    }, 1000);
  } catch (error) {
    console.error("Error capturing photo: ", error);
  }
};

const submitVisitorData = async (payload: VisitorData) => {
  try {
    await createVisitAPI(payload);

    // if (res && res.data) {
    //   await QRCode.toDataURL(res.data.visit_no)
    //     .then((url: string) => {
    //       qrCodeUrl.value = url;
    //     })
    //     .catch((err: Error) => {
    //       error.value = 'Error generating QR Code';
    //     });
    // 
      await getVisitorData();
      showSnackbar('Visitor added successfully!', 'success');
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.';
    showSnackbar(error.value, 'error');
  }
};

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
    await getVisitorData();
    showSnackbar('Checkout successful', 'success');
  } else {
    showSnackbar('Checkout failed', 'error');
  }
};

// QR code scan error
const onError = (err: Error) => {
  error.value = `QR Code Error: ${err.message}`;
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

const updateVisitorData = async () => {
  try {
    const res = await updateVisitAPI(formData.value.visit_id);

    if (res) {
      formData.value = res.data;
      showSnackbar('Visitor updated successfully!', 'success');
      await getVisitorData();
      cancelEdit();
    } else {
      showSnackbar('Error updating visitor', 'error');
    }
  } catch (err: any) {
    error.value = err.response?.data?.message || 'An error occurred. Please try again.(error)';
  }
};

const cancelEdit = () => {
  formData.value = {
    visit_name: '',
    // vendor_name: '',
    // vehicle_name: '',
    // identitas_name: '',
    // destinate_name: '',
    // purpose_name: '',
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
    check_out: null,
    status: '',
    // img_url: '',
  }; // Reset form
  isEditing.value = false; // Exit edit mode
};

const handleSubmit = () => {
  submitVisitorData(formData.value); // Call API
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

<template>
  <Parent-card title="Visitor Form" v-loading="loading">
    <v-row>
      <v-col cols="12">
        <v-form>
          <v-row>
            <v-col cols="6">
              <v-text-field label="Visitor Name" v-model="formData.visit_name" variant="outlined" />
              <v-select
                v-model="formData.selectedVendor"
                :items="dropdownOptions.vendors"
                item-title="vendor_name"
                item-value="vendor_id"
                label="Vendor Name"
                variant="outlined"

              />
              <v-select
                v-model="formData.selectedVehicle"
                :items="dropdownOptions.vehicles"
                item-title="vehicle_name"
                item-value="vehicle_id"
                label="Vehicle Type"
                variant="outlined"

              />
              <v-text-field label="Police Number" v-model="formData.vehicle_no" variant="outlined" />
              <!-- Camera Button & Preview -->
              <v-btn color="blue" @click="capturePhoto">Capture Photo</v-btn>

              <!-- Display captured photo -->
              <v-img v-if="img_url" :src="img_url" alt="Captured photo" max-width="320" class="mt-4" />

              <video v-if="cameraOpen" ref="video" autoplay width="320" height="240" class="mt-2"></video>
            </v-col>

            <v-col cols="6">
              <v-text-field label="Driver Name" v-model="formData.driver_name" variant="outlined" />
              <v-select
                v-model="formData.selectedIdType"
                :items="dropdownOptions.idTypes"
                item-title="identitas_name"
                item-value="identitas_id"
                label="ID Type"
                variant="outlined"

              />
              <v-text-field label="ID Number" v-model="formData.identitas_no" variant="outlined" />
              <v-select
                v-model="formData.selectedDestinateBuilding"
                :items="dropdownOptions.destinateBuildings"
                item-title="destinate_name"
                item-value="destinate_id"
                label="Destination Building"
                variant="outlined"
                />
              <v-text-field label="Destination PIC" v-model="formData.destinate_pic" variant="outlined" />
              <v-select
                v-model="formData.selectedVisitorPurpose"
                :items="dropdownOptions.purposes"
                item-title="purpose_name"
                item-value="purpose_id"
                label="Visitor Purpose"
                variant="outlined"

              />
              <v-text-field label="Notes" v-model="formData.remarks" variant="outlined" />
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>

    <v-row class="mb-5">
      <v-col cols="6">
        <v-btn v-if="isEditing" class="mr-4" color="primary" @click="updateVisitorData">Update</v-btn>
        <v-btn v-if="isEditing" class="mr-4" color="red" @click="cancelEdit">Cancel</v-btn>
        <v-btn v-else class="mr-4" color="primary" @click="handleSubmit" type="submit" >Submit</v-btn>
        <v-btn class="mr-4" variant="outlined" @click="getVisitorData">Refresh</v-btn>

        <v-btn color="green" @click="cameraOpen = !cameraOpen">Checkout with QR Code</v-btn>

        <div v-if="cameraOpen" class="mt-2" style="border: 2px solid black; padding: 10px;">
          <qrcode-stream @detect="onDetect" @error="onError" />
          <p class="mt-2 text-error" v-if="error">{{ error }}</p>
          <p class="mt-2">Last scan result: <strong>{{ result }}</strong></p>
        </div>

        <v-img v-if="qrCodeUrl" :src="qrCodeUrl" alt="Generated QR code" max-width="320" class="mt-4" />
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
              <v-btn icon @click="deleteVisitor(item.visit_id)">
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
              <v-btn icon @click="checkoutVisitor(item.visit_id)" v-if="!item.check_out">
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

<style scoped>
.elevation-1 {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
