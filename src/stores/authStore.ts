import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<string | null>(null);
  const token = ref<string | null>(null);
  const errorMessage = ref<string | null>(null);
  const router = useRouter();

  // Actions
  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.API_BASE_URL}/register`, {
        email,
        password,
      });
      token.value = response.data.token;
      user.value = response.data.user;
      errorMessage.value = null;
    } catch (error) {
      errorMessage.value = 'Registration failed';
      console.error(error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.API_BASE_URL}/login`, {
        email,
        password,
      });
      token.value = response.data.token;
      user.value = email;
      errorMessage.value = null;

       // Save token to localStorage
      localStorage.setItem('token', token.value ?? '');
    } catch (error) {
      errorMessage.value = 'Login failed';
      console.error(error);
    }
  };



// ...
const logout = () => {
  token.value = null;
  user.value = null;
  errorMessage.value = null;

  // Remove token from localStorage
  localStorage.removeItem('token');

  // Redirect to login page
  router.push('/login');
};

const isAuthenticated = () => {
  return !!token.value;
};

  return {
    user,
    token,
    errorMessage,
    register,
    login,
    logout,
    isAuthenticated,
  };
});
