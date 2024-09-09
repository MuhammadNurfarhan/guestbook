import { ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const router = useRouter();
  const user = ref<string | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const error = ref<string | null>(null);

  // Actions
  const register = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, {
        email,
        password,
      });
      token.value = response.data.token;
      user.value = response.data.user;
    } catch (error: any) {
      error.value = 'Registration failed';
      console.error(error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        email,
        password,
      });

      // if login success
      token.value = response.data.token;
      user.value = email;

      // Save token to localStorage
      localStorage.setItem('token', token.value ?? '');
      return true;
    } catch (error: any) {
        if (error.response && error.response.error) {
          error.value = 'Invalid email or password';
        } else if (error.response && error.response.status === 404) {
          error.value = 'User not found';
        } else if (error.response && error.response.status === 500) {
          error.value = 'Internal server error';
        } else {
          error.value = 'An error occurred while logging in. Please try again later.';
        }
        console.error(error);

        return false;
      }
  }

  const logout = () => {
    token.value = null;
    user.value = null;
    error.value = null;

    // Remove token from localStorage
    localStorage.removeItem('token');

    // Redirect to login page
    router.push('/login');
  };

  return {
    user,
    token,
    register,
    login,
    logout,
    error,
  };
});
