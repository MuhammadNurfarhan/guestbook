<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="text-h5">Guest Book</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="name"
                :rules="[rules.required]"
                label="Name"
                required
              ></v-text-field>

              <v-text-field
                v-model="message"
                :rules="[rules.required]"
                label="Message"
                required
              ></v-text-field>

              <v-btn
                :disabled="!valid"
                color="primary"
                @click="submitEntry"
              >
                Submit
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="text-h5">Guest Entries</span>
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(entry, index) in guestEntries"
                :key="index"
              >
                <v-list-item>
                  <v-list-item-title>{{ entry.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ entry.message }}</v-list-item-subtitle>
                </v-list-item>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useGuestBookStore } from '../stores/guestBookStore';

// State
const valid = ref<boolean>(false);
const name = ref<string>('');
const message = ref<string>('');

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
};

// Store
const guestBookStore = useGuestBookStore();

// Computed
const guestEntries = guestBookStore.guestEntries;

// Methods
const submitEntry = () => {
  if (valid.value) {
    guestBookStore.addEntry({ name: name.value, message: message.value });
    name.value = '';
    message.value = '';
  }
};
</script>

<style scoped>
.v-application {
  font-family: 'Roboto', sans-serif;
}
</style>
