<script setup lang="ts">
import { createVisitAPI, updateVisitAPI } from '@/api/visit/visit';
import { getVendorAPI } from '@/api/master/masterVendor';
import { getVehicleAPI } from '@/api/master/masterVehicle';
import { getIdentityAPI } from '@/api/master/masterIdentity';
import { getDestinateAPI } from '@/api/master/masterDestinate';
import { getPurposeAPI } from '@/api/master/masterPurpose';
import { useLoading } from '@/hooks';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength, maxLength, helpers } from '@vuelidate/validators';

const props = defineProps({
  showDialog: Boolean,
  action: Object,
});
const emit = defineEmits(['close']);

const { loading, showLoading, hideLoading } = useLoading();

const webcamAvailable = ref<boolean>(false);
const webcamError = ref<string | null>(null);
const video = ref<HTMLVideoElement | null>(null);
const capturedImage = ref<string | null>(null);
let stream: MediaStream | null = null;

const state = reactive({
  formData: {
    "Created_by":"189b4920-e793-4075-bebe-03be7355c62b",
    "Created_date":"",
    "Destinate_id":"",
    "Destinate_pic":"",
    "Driver_name":"",
    "Identitas_id":"",
    "Identitas_no":"",
    "Img_url":"",
    "Purpose_id":"",
    "Remarks":"",
    "Status":"",
    "Updated_by":"",
    "Updated_date":"",
    "Vehicle_id":"",
    "Vehicle_no":"",
    "Vendor_id":"",
    "visit_id":"",
    "Visit_name":"",
    "Visit_no":"",
    "Visit_count":"",
    "Email":"",
    "Check_in":"",
    "Check_out":"",
  },
});

// Validation rules using Vuelidate
const rules = computed(() => ({
  formData: {
    Visit_name: { required: helpers.withMessage('Visit name is required', required) },
    Vendor_id: { required: helpers.withMessage('Vendor is required', required) },
    Vehicle_id: { required: helpers.withMessage('Vehicle is required', required) },
    Vehicle_no: { required: helpers.withMessage('Vehicle number is required', required), maxLength: maxLength(10) },
    Destinate_pic: { required: helpers.withMessage('Destination PIC is required', required) },
    Email: { required: helpers.withMessage('Email is required', required), email: helpers.withMessage('Email must be valid', email) },
    Identitas_id: { required: helpers.withMessage('ID type is required', required) },
    Identitas_no: { required: helpers.withMessage('ID number is required', required), minLength: minLength(8) },
    Destinate_id: { required: helpers.withMessage('Destination building is required', required) },
    Purpose_id: { required: helpers.withMessage('Visitor purpose is required', required) },
    Remarks: { required: helpers.withMessage('Remarks are required', required) }
  }
}));

const v$ = useVuelidate(rules, state);

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

const fetchDropdownOptions = async () => {
  try {
    const [vendors, vehicles, idTypes, destinateBuildings, purposes] = await Promise.all([
      getVendorAPI(), getVehicleAPI(), getIdentityAPI(), getDestinateAPI(), getPurposeAPI(),
    ]);
    dropdownOptions.value = {
      vendors: vendors.data,
      vehicles: vehicles.data,
      idTypes: idTypes.data,
      destinateBuildings: destinateBuildings.data,
      purposes: purposes.data,
    };
  } catch (error) {
    console.error('Error fetching dropdown options:', error);
  }
};

const handleCancelClick = () => {
  emit('close');
};

const convertDataURLToBlob  = (dataURL: string) => {
  const byteString = atob(dataURL.split(',')[1]);
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};

const handleSaveClick = () => {
  v$.value.$touch(); // Trigger validation checks
  if (!v$.value.$pending && v$.value.$invalid) {
    console.log('Form is invalid!');
    return;
  }

  const formData = new FormData();

  // Append the form data fields to FormData
  Object.keys(state.formData).forEach(key => {
    formData.append(key, (state.formData as any)[key]);
  });

  // Check if an image was captured and append it to FormData
  if (capturedImage.value) {
    const blob = convertDataURLToBlob(capturedImage.value);
    formData.append('File', blob, 'visit-photo.png');
  }

  const request =
    props.action.type === "create"
      ? createVisitAPI
      : updateVisitAPI;

  request(formData)
    .then(() => {
      emit('close');
    })
    .catch((error) => {
      console.error('Error saving visit:', error);
    });
};

// Start the webcam video stream
const startWebcam = async () => {
  showLoading();

  // Check if browser supports getUserMedia
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    webcamError.value = "Your browser does not support accessing the webcam.";
    webcamAvailable.value = false;
    hideLoading();
    return;
  }

  // Ensure site is served over HTTPS or localhost
  if (location.protocol !== "https:" && location.hostname !== "localhost") {
    webcamError.value = "Webcam access requires HTTPS. Please use a secure connection.";
    webcamAvailable.value = false;
    hideLoading();
    return;
  }

  try {
    // Request webcam access
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    await nextTick(); // Ensure DOM updates before accessing the video element

    if (video.value) {
      video.value.srcObject = stream;
      webcamAvailable.value = true;
      webcamError.value = null;
    } else {
      webcamError.value = "Video element not found.";
      console.error("Video ref is undefined.");
    }
  } catch (err: any) {
    console.error("Error accessing webcam:", err);
    handleWebcamError(err);
  }

  hideLoading();
};

// Stop the webcam stream
const stopWebcam = () => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
    webcamAvailable.value = false;
    if (video.value) {
      video.value.srcObject = null;
    }
  }
};

// Function to handle webcam errors
const handleWebcamError = (err: Error) => {
  switch (err.name) {
    case "NotAllowedError":
      webcamError.value = "Permission denied: Unable to access the webcam.";
      break;
    case "NotFoundError":
      webcamError.value = "No webcam found. Please connect a webcam.";
      break;
    case "NotReadableError":
      webcamError.value = "Webcam is currently in use or not accessible.";
      break;
    case "OverconstrainedError":
      webcamError.value = "Webcam constraints are not supported by the browser.";
      break;
    default:
      webcamError.value = "An unexpected error occurred while accessing the webcam.";
      break;
  }
};

// Capture image from the video stream
const captureImage = () => {
  if (!webcamAvailable.value) {
    webcamError.value = "Webcam is not available.";
    return;
  }

  showLoading();

  const videoEl = video.value;
  if (!videoEl) {
    webcamError.value = "Video element not found.";
    hideLoading();
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  const context = canvas.getContext("2d");

  if (context) {
    context.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
    capturedImage.value = canvas.toDataURL("image/png");
  }

  hideLoading();
};

// Reset captured image to retake a new one
const resetCapture = () => {
  capturedImage.value = null;
  startWebcam();
};

// Start webcam button handler
const btnstart = () => {
  startWebcam();
};

onMounted(async () => {
  await fetchDropdownOptions();
  startWebcam();
});

onBeforeMount(() => {
  stopWebcam();

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
            <v-col cols="4">
              <v-text-field
                v-model="state.formData.Visit_name"
                label="Visitor Name"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Visit_name.$errors.map(e => e.$message)"
              />
              <v-select
                v-model="state.formData.Vendor_id"
                label="Vendor Name"
                :items="dropdownOptions.vendors"
                item-title="vendor_name"
                item-value="vendor_id"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Vendor_id.$errors.map(e => e.$message)"
              />
              <v-select
                v-model="state.formData.Vehicle_id"
                label="Vehicle Type"
                :items="dropdownOptions.vehicles"
                item-title="vehicle_name"
                item-value="vehicle_id"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Vehicle_id.$errors.map(error => error.$message)"
              />
              <v-text-field label="Police Number" v-model="state.formData.Vehicle_no" variant="outlined" color="primary" :error-messages="v$.formData.Vehicle_no.$errors.map(error => error.$message)" />
              <v-text-field label="Destination PIC" v-model="state.formData.Destinate_pic" variant="outlined" color="primary" :error-messages="v$.formData.Destinate_pic.$errors.map(error => error.$message)" />
              <v-text-field label="Email" v-model="state.formData.Email" variant="outlined" type="email" color="primary" :error-messages="v$.formData.Email.$errors.map(e => e.$message)" />
            </v-col>

            <v-col cols="4">
              <v-text-field label="Driver Name" v-model="state.formData.Driver_name" variant="outlined" color="primary" />
              <v-select
                v-model="state.formData.Identitas_id"
                :items="dropdownOptions.idTypes"
                item-title="identitas_name"
                item-value="identitas_id"
                label="ID Type"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Identitas_id.$errors.map(error => error.$message)"
              />
              <v-text-field label="ID Number" v-model="state.formData.Identitas_no" variant="outlined" type="number" color="primary" :error-messages="v$.formData.Identitas_no.$errors.map(error => error.$message)" />
              <v-select
                v-model="state.formData.Destinate_id"
                :items="dropdownOptions.destinateBuildings"
                item-title="destinate_name"
                item-value="destinate_id"
                label="Destination Building"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Destinate_id.$errors.map(error => error.$message)"
              />
              <v-select
                v-model="state.formData.Purpose_id"
                :items="dropdownOptions.purposes"
                item-title="purpose_name"
                item-value="purpose_id"
                label="Visitor Purpose"
                variant="outlined"
                color="primary"
                :error-messages="v$.formData.Purpose_id.$errors.map(error => error.$message)"
              />
              <v-text-field label="Notes" v-model="state.formData.Remarks" variant="outlined" color="primary" :error-messages="v$.formData.Remarks.$errors.map(error => error.$message)" />
            </v-col>

            <v-col cols="4" class="text-center">
              <!-- Error alert -->
              <div v-if="webcamError" class="mb-4">
                <v-alert type="error" dismissible>{{ webcamError }}</v-alert>
              </div>

              <!-- Loading spinner when initializing the webcam -->
              <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"
                size="50"
              ></v-progress-circular>

              <!-- Debug message for video element -->
              <div v-if="!loading && !capturedImage && !webcamAvailable">
                Video element is not rendered yet.
              </div>

              <!-- Video stream from webcam -->
              <video
                v-else-if="!capturedImage"
                ref="video"
                width="100%"
                autoplay
                playsinline
                class="mb-4"
              ></video>

              <!-- Captured image preview -->
              <img
                v-else
                :src="capturedImage"
                alt="Captured Image"
                class="captured-image mb-4"
              />

              <!-- Capture and control buttons -->
              <v-btn
                color="primary"
                class="mt-4"
                @click="captureImage"
                :disabled="!webcamAvailable || loading"
              >
                Capture Image
              </v-btn>
              <v-btn
                color="green"
                class="mt-4 ml-2"
                @click="btnstart"
                :disabled="!stopWebcam || webcamAvailable || loading"
              >
                Start Webcam
              </v-btn>
              <v-btn
                color="red"
                class="mt-4 ml-2"
                @click="stopWebcam"
                :disabled="!webcamAvailable || loading"
              >
                Stop Webcam
              </v-btn>

              <!-- Reset button (to retake image) -->
              <v-btn
                v-if="capturedImage"
                color="warning"
                class="mt-4 ml-2"
                @click="resetCapture"
              >
                Retake Image
              </v-btn>
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

<style lang="scss" scoped>
.captured-image {
  width: 100%;
  max-height: 300px;
  object-fit: cover;
}
</style>
