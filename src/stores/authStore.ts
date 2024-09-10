import { onMounted, ref } from 'vue';
import axios from 'axios';
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
  // State
  const router = useRouter();
  const role = ref<string | null>(localStorage.getItem('role') || null);
  const token = ref<string | null>(localStorage.getItem('token'));

  // Actions
  const register = async (email: string, password: string, name: string) => {
    if (!email || !password || !name) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user`, {
        email,
        password,
        name,
      });
      console.log(response.data);
      alert('Registered successfully');
    } catch (error: any) {
      console.error('Error registering:', error.response.data.message);
      alert('Error registering: ' + error.response.data.message);
    }
  };

  const login = async (email: string, password: string) => {
    try {

      // Send login request
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        email,
        password,
      });

      const userData = response.data.data;
      // Immediately set role and token in the reactive store
      role.value = userData.role;  // This updates the reactive ref
      token.value = userData.token;

      // Store the user's name
      localStorage.setItem('role', userData.role);  // Store the name in localStorage
      localStorage.setItem('token', userData.token);
      router.push({ name: 'Dashboard' });
    } catch (error) {
      console.error('Error login:', error);
      alert('Error login');
    }
  };

  const logout = () => {
    role.value = null;
    token.value = null;

    // Remove token/role from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login page
    router.push('/login');
  };

  // Automatically restore user on mount
  onMounted(() => {
    const storedUser = localStorage.getItem('role');
    if (storedUser) {
      return role.value = storedUser;
    }
    return role.value = null;

  });

  return {
    role,
    token,
    register,
    login,
    logout,
  };
});
