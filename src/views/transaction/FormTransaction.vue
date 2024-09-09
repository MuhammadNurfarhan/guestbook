<template>
  <v-row>
    <v-col cols="6">
      <v-text-field label="Visitor ID" v-model="visitorId" variant="outlined" />
      <v-text-field label="Visitor Name" v-model="visitorName" variant="outlined" />
      <v-select
        :items="vendorNames"
        label="Vendor Name"
        v-model="vendorName"
        variant="outlined"
      />
      <v-select
        :items="vehicleTypes"
        label="Vehicle Type"
        v-model="vehicleType"
        variant="outlined"
      />
      <v-text-field label="Police Number" v-model="policeNumber" variant="outlined" />
      <v-radio-group row label="Visit Status">
        <v-radio
          label="In"
          value="in"
          v-model="inOrOut"
        />
        <v-radio
          label="Out"
          value="out"
          v-model="inOrOut"
        />
      </v-radio-group>
    </v-col>

    <v-col cols="6">
      <v-text-field label="Driver Name" v-model="driverName" variant="outlined" />
      <v-select
        :items="idTypes"
        label="ID Type"
        v-model="idType"
        variant="outlined"
      />
      <v-text-field label="ID Number" v-model="idNumber" variant="outlined" />
      <v-select
        :items="destinateBuildings"
        label="Destination Building"
        v-model="destinateBuilding"
        variant="outlined"
      />
      <v-text-field label="Destination PIC" v-model="destinatePic" variant="outlined" />
      <v-select
        :items="visitorPurposes"
        label="Visitor Purpose"
        v-model="visitorPurpose"
        variant="outlined"
      />
      <v-text-field label="Remark" v-model="remarks" variant="outlined" />
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="6">
      <v-btn @click="emitSave">Save</v-btn>
      <v-btn @click="emitUpdate">Update</v-btn>
      <v-btn @click="emitRefresh">Refresh</v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ref, defineEmits  } from 'vue';

const emit = defineEmits(['save', 'update', 'refresh']);

const visitorId = ref('');
const visitorName = ref('');
const vendorName = ref('');
const vendorNames = ref(['PT A', 'PT B', 'PT C']); // Sample vendor names
const vehicleType = ref('');
const vehicleTypes = ref(['BOX', 'WINGBOX', 'ENGKAL']); // Sample car types
const policeNumber = ref('');
const driverName = ref('');
const idType = ref('');
const idTypes = ref(['E-KTP', 'SIM']); // Sample ID types
const destinateBuilding = ref('');
const destinateBuildings = ref(['BUILDING A', 'BUILDING B', 'BUILDING C']); // Sample destination buildings
const destinatePic = ref('');
const visitorPurpose = ref('');
const visitorPurposes = ref(['PURPOSE A', 'PURPOSE B', 'PURPOSE C']); // Sample visitor purposes
const remarks = ref('');
const inOrOut = ref('');
const idNumber = ref('');

const emitSave = () => {
  emit('save', {
    visitorId: visitorId.value,
    visitorName: visitorName.value,
    vendorName: vendorName.value,
    vehicleType: vehicleType.value,
    policeNumber: policeNumber.value,
    driverName: driverName.value,
    idType: idType.value,
    destinateBuilding: destinateBuilding.value,
    destinatePic: destinatePic.value,
    visitorPurpose: visitorPurpose.value,
    remarks: remarks.value,
    inOrOut: inOrOut.value,
    idNumber: idNumber.value,
  });
};

const emitUpdate = () => {
  emit('update', {
    visitorId: visitorId.value,
    visitorName: visitorName.value,
    vendorName: vendorName.value,
    vehicleType: vehicleType.value,
    policeNumber: policeNumber.value,
    driverName: driverName.value,
    idType: idType.value,
    destinateBuilding: destinateBuilding.value,
    destinatePic: destinatePic.value,
    visitorPurpose: visitorPurpose.value,
    remarks: remarks.value,
    inOrOut: inOrOut.value,
    idNumber: idNumber.value,
  });
};

const emitRefresh = () => {
  emit('refresh');
};
</script>
