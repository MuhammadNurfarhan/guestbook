<template>
  <v-container class="fill-height">
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="bg-success mb-5">
            <span class="text-h5">Login</span>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation @keyup.enter="submitLogin">
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
                :rules="[rules.required, rules.password]"
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
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/authStore';
import { useRouter } from 'vue-router';

// State
const valid = ref<boolean>(false);
const email = ref<string>(localStorage.getItem('email') || '');
const password = ref<string>('');
const error = ref<string | null>(null);
// Store and Router
const authStore = useAuthStore();
const router = useRouter();

// Validation rules
const rules = {
  required: (value: string) => !!value || 'Required.',
  email: (value: string) => /.+@.+\..+/.test(value) || 'E-mail must be valid.',
  password: (value: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(value) || 'Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, one number.';
  },
};

// Methods
const submitLogin = async () =>  {
  error.value = null;
  const success = await authStore.login(email.value, password.value);

  if (success !== null) {
    // Redirect to dashboard
    router.push('/dashboard');
  } else {
    // Handle error
    error.value = 'Invalid email or password';
  }
};

// Watcher to save input values to localStorage
// watch(email, (newValue) => {
//   localStorage.setItem('email', newValue);
// });

</script>
