<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title>
            <span class="text-h5">Login</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-text-field
                v-model="email"
                :rules="[rules.required, rules.email]"
                label="Email"
                type="email"
                variant="outlined"
                class="mb-2"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :rules="[rules.required]"
                label="Password"
                type="password"
                variant="outlined"
                required
              ></v-text-field>

              <v-btn :disabled="!valid" color="primary" @click="submitLogin">
                Login
              </v-btn>
              <p class="mt-2">
                Don't have an account? <span class="text-decoration-underline"><router-link to="/register">Register</router-link></span>
              </p>

              <v-alert v-if="errorMessage" type="error" dense>
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

// State
const valid = ref(false);
const email = ref('');
const password = ref('');

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
};

// Store and Router
const authStore = useAuthStore();
const router = useRouter();

// Computed
const errorMessage = authStore.errorMessage;

// Methods
const submitLogin = async () => {
  await authStore.login(email.value, password.value);
  if (!errorMessage?.valueOf && authStore.isAuthenticated()) {
    router.push('/dashboard');
  }
};
</script>
