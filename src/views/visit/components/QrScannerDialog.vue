<script setup lang="ts">
import { QrcodeStream } from 'vue3-qrcode-reader';

// Emit an event to notify the parent component of the scan result
const emit = defineEmits(['qrScanned', 'close']);

// Props to control visibility of the dialog
const props = defineProps({
  showQRScanner: Boolean,
});

// Local data property to control dialog visibility
const showDialog = computed({
  get: () => props.showQRScanner,
  set: () => {
    emit('close');
  },
});

// Method to handle scanned QR code result
const onQrCodeScanned = (result: string) => {
  emit('qrScanned', result); // Emit the scanned result to parent
};


const closeDialog = () => {
  emit('close');
};
</script>

<template>
  <v-dialog v-model="showDialog" width="500px">
    <v-card>
      <v-card-title class="text-h5">Scan QR Code</v-card-title>
      <v-card-text>
        <QrcodeStream @decode="onQrCodeScanned" />
      </v-card-text>
      <v-card-actions>
        <v-btn class="bg-primary" @click="closeDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
