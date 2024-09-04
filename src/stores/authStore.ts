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
      const response = await axios.post('https://172.17.10.222:433/api/user/login', {
        email,
        password,
      });

      token.value = response.data.token;
      errorMessage.value = null;
      user.value = email;

      // Save token to localStorage
      localStorage.setItem('token', token.value ?? '');
      return true;
    } catch (error: any) {
      if (error.response && error.response.status === 401) {
        errorMessage.value = 'Invalid email or password.';
      } else if (error.response && error.response.status === 400) {
        errorMessage.value = 'User not registered.';
      } else {
        errorMessage.value = 'An error occurred during login. Please try again.';
      }
      throw error;
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

  return {
    user,
    token,
    errorMessage,
    register,
    login,
    logout,
  };
});
